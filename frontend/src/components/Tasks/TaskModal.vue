<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import store from '../../store';
import type { Task, TaskEdit } from '@/types/tasks';
import type { Client } from '@/types/clients';
import { i18n } from '@/utils/localization';

const props = defineProps<{
  open: boolean;
  editedItem: Task | null;
}>();

const emit = defineEmits(['close']);

const isAdmin = computed(() => store.getters['user/isAdmin']);

const defaultItem: Task = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: null,
    _id: '',
    client: {
        _id: ''
    },
    assigneeId: ''
};

const localEditedItem = ref<Task>({ ...defaultItem });
const isDatepickerOpen = ref(false);
const clients = ref<Client[]>([]);
const loadingClients = ref(false);

watch(() => props.open, (val) => {
    if (val) {
        if (props.editedItem) {
            localEditedItem.value = { ...props.editedItem };
            if (props.editedItem.client && props.editedItem.client._id) {
                clients.value = [props.editedItem.client as unknown as Client];
            }
        } else {
            localEditedItem.value = { ...defaultItem };
            clients.value = [];
        }
        store.commit('tasks/SET_ERROR', '');
    }
});

const statusOptions = [
    { text: 'pending', value: 'pending' },
    { text: 'in_progress', value: 'in_progress' },
    { text: 'completed', value: 'completed' }
];

const priorityOptions = [
    { text: 'low', value: 'low' },
    { text: 'medium', value: 'medium' },
    { text: 'high', value: 'high' }
];

let searchTimeout:number;
const onClientSearch = (val: string | null) => {
    if (val && clients.value.some(c => c.name === val)) {
        return;
    }
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchClients(val || '');
    }, 500);
};

const fetchClients = async (search = '') => {
    loadingClients.value = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = store.state.user?.token;
    const selection = isAdmin.value ? 'all' : 'my';
    try {
        const response = await axios.get(`${backendUrl}/clients?selection=${selection}&limit=5&search=${search}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        clients.value = response.data.clients;
    } catch (e) {
        console.error(e);
    } finally {
        loadingClients.value = false;
    }
};

const save = async () => {
    const dataForBackend = (Object.keys(localEditedItem.value) as Array<keyof Task>).reduce((acc, key) => ({
        ...acc,
        [key]: localEditedItem.value[key] || null
    }), {} as Record<string, unknown>) as unknown as TaskEdit;

    dataForBackend.clientId = dataForBackend.client._id;
    const newClient = clients.value.find(client => client._id === dataForBackend.client._id);
    dataForBackend.client.name = newClient?.name || '';
    dataForBackend.client._id = newClient?._id || '';

    let success;
    if (dataForBackend._id) {
        success = await store.dispatch('tasks/updateTask', dataForBackend);
    } else {
        const {_id, ...dataForBackendWithoutId} = dataForBackend;
        success = await store.dispatch('tasks/createTask', dataForBackendWithoutId);
    }
    if (success) {
        close();
    }
};

const error = computed(() => store.getters['tasks/error']);

const close = () => {
    store.commit('tasks/CLEAR_ERROR');
    emit('close', false);
};
</script>

<template>
  <v-dialog :value="open" @input="emit('close', $event)" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editedItem ? 'Редактировать задачу' : 'Новая задача' }}</span>
      </v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error" dense text class="mb-4">
          {{ i18n(error) }}
        </v-alert>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="localEditedItem.title" label="Название задачи"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="localEditedItem.client._id"
                :items="clients"
                :loading="loadingClients"
                @update:search-input="onClientSearch"
                @focus="fetchClients()"
                no-filter
                item-text="name"
                item-value="_id"
                label="Клиент"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="localEditedItem.status" :items="statusOptions" label="Статус"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="localEditedItem.priority" :items="priorityOptions" label="Приоритет"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu v-model="isDatepickerOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="localEditedItem.dueDate"
                    label="Срок выполнения"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker v-model="localEditedItem.dueDate" @input="isDatepickerOpen = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="localEditedItem.description" label="Описание" rows="3"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
        <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>