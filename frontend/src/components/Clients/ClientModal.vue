<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import store from '../../store';
import type {Client} from '@/types/clients';
import { i18n } from '@/utils/localization';

const props = defineProps<{
  open: boolean;
  editedItem: Client | null;
}>();

const emit = defineEmits(['close']);

const defaultItem: Client = {
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    status: 'lead',
    _id: '',
    managerId: ''
};

const localEditedItem = ref<Client>({ ...defaultItem });

watch(() => props.open, (val) => {
    if (val) {
        localEditedItem.value = props.editedItem ? { ...props.editedItem } : { ...defaultItem };
    }
});

const statusOptions = ['active', 'inactive', 'lead'];

const error = computed(() => store.getters['clients/error']);

const close = () => {
    store.commit('clients/CLEAR_ERROR');
    emit('close', false);
};

const save = async () => {
    const dataForBackend = (Object.keys(localEditedItem.value) as Array<keyof Client>).reduce((acc, key) => ({
        ...acc,
        [key]: localEditedItem.value[key] || null
    }), {} as Record<string, unknown>) as unknown as Client;

    let success;
    if (dataForBackend._id) {
        success = await store.dispatch('clients/updateClient', dataForBackend);
    } else {
        const {_id, ...dataForBackendWithoutId} = dataForBackend;
        success = await store.dispatch('clients/createClient', dataForBackendWithoutId);
    }
    if (success) {
        close();
    }
};
</script>

<template>
  <v-dialog :value="open" @input="emit('close', $event)" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Новый клиент</span>
      </v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error" dense text class="mb-4">
          {{ i18n(error) }}
        </v-alert>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12">
              <v-text-field v-model="localEditedItem.name" label="Имя"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="localEditedItem.email" label="Email"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="localEditedItem.phone" label="Телефон"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field v-model="localEditedItem.company" label="Компания"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-select v-model="localEditedItem.status" :items="statusOptions" label="Статус"></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="localEditedItem.notes" label="Заметки" rows="3"></v-textarea>
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