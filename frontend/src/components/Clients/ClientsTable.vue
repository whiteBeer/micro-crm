<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ClientModal from './ClientModal.vue';
import store from '@/store';
import type {Client} from '@/types/clients';

interface ITableOptions {
    page: number;
    itemsPerPage: number;
}

const props = defineProps<{
    selection: string;
}>();

const search = ref('');
const dialog = ref(false);
const headers = [
    { text: 'Имя', value: 'name', sortable: false },
    { text: 'Email', value: 'email', sortable: false },
    { text: 'Телефон', value: 'phone', sortable: false },
    { text: 'Компания', value: 'company', sortable: false },
    { text: 'Статус', value: 'status', sortable: false },
    { text: 'Действия', value: 'actions', sortable: false },
];
const clients = computed(() => store.getters['clients/allClients']);
const total = computed(() => store.getters['clients/total']);
const limit = computed(() => store.getters['clients/limit']);
const loading = computed(() => store.getters['clients/isLoading']);
const error = computed(() => store.getters['clients/error']);
const options = ref<ITableOptions>({page: 1, itemsPerPage: 0});

const editedItem = ref<Client | null>(null);

const addClient = () => {
    editedItem.value = null;
    dialog.value = true;
};

const editClient = (item:Client) => {
    editedItem.value = item;
    dialog.value = true;
};

const deleteClient = async (item:Client) => {
    await store.dispatch('clients/deleteClient', item._id);
};

// TODO: make debounce in common way
let timeout: any;
watch(search, async (val: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        store.commit('clients/SET_SEARCH', val);
        store.commit('clients/SET_SKIP', 0);
        if (options.value.page !== 1) {
            options.value = { ...options.value, page: 1 };
        } else {
            store.dispatch('clients/fetchClients', props.selection);
        }
    }, 500);
});

watch(options, async (newOptions:ITableOptions, oldOptions:ITableOptions) => {
    const { page, itemsPerPage } = newOptions;
    if (page !== oldOptions.page || itemsPerPage !== oldOptions.itemsPerPage) {
        const skip = (page - 1) * itemsPerPage;
        store.commit('clients/SET_LIMIT', itemsPerPage);
        store.commit('clients/SET_SKIP', skip);
        await store.dispatch('clients/fetchClients', props.selection);
    }
});

watch(() => props.selection, async () => {
    store.commit('clients/SET_CLIENTS', []);
    store.commit('clients/SET_LOADING', true);
    store.commit('clients/SET_SKIP', 0);
    if (options.value.page !== 1) {
        options.value = { ...options.value, page: 1 };
    }
    await store.dispatch('clients/fetchClients', props.selection);
});

options.value = {page: 1, itemsPerPage: limit.value};

</script>

<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-btn :disabled="error === 'access_denied'"
               color="primary" @click="addClient">
          <v-icon left>mdi-plus</v-icon>
          Добавить клиента
        </v-btn>
      </v-col>

      <ClientModal :open="dialog"
                   @close="dialog = false"
                   :editedItem="editedItem" />

      <v-col cols="12" sm="6">
        <v-text-field
          :disabled="error === 'access_denied'"
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <v-alert v-if="error === 'access_denied'" type="error" dense text class="mb-4">
        {{ error }}
    </v-alert>
    <v-data-table
      :headers="headers"
      :items="clients"
      :server-items-length="total"
      :options.sync="options"
      :loading="loading"
      :footer-props="{
          'items-per-page-options': [2, 5, 10, 50],
          'items-per-page-text': 'Клиентов на странице'
      }"
      :items-per-page="limit"
      v-if="error !== 'access_denied'"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editClient(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteClient(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>
</style>
