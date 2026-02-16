<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ClientModal from './ClientModal.vue';
import ClientsTableControl from './ClientsTableControl.vue';
import store from '@/store';
import type {Client} from '@/types/clients';

interface ITableOptions {
    page: number;
    itemsPerPage: number;
}

const props = defineProps<{
    selection: string;
}>();

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
const currentUser = computed(() => store.getters['user/currentUser']);
const options = ref<ITableOptions>({page: 1, itemsPerPage: limit.value});

const editedItem = ref<Client | null>(null);

const addClient = () => {
    editedItem.value = null;
    dialog.value = true;
};

const editClient = (item:Client) => {
    editedItem.value = item;
    dialog.value = true;
};

const resetStoreAndFetch = async () => {
    store.commit('clients/SET_CLIENTS', []);
    store.commit('clients/SET_LOADING', true);
    store.commit('clients/SET_SKIP', 0);
    if (options.value.page !== 1) {
        options.value = { ...options.value, page: 1 };
    }
    await store.dispatch('clients/fetchClients', props.selection);
};

const deleteClient = async (item:Client) => {
    if (confirm('Вы уверены, что хотите удалить клиента?')) {
        await store.dispatch('clients/deleteClient', item._id);
    }
};

watch(options, async (newOptions:ITableOptions, oldOptions:ITableOptions) => {
    const { page, itemsPerPage } = newOptions;
    if (page !== oldOptions.page || itemsPerPage !== oldOptions.itemsPerPage) {
        const skip = (page - 1) * itemsPerPage;
        store.commit('clients/SET_LIMIT', itemsPerPage);
        store.commit('clients/SET_SKIP', skip);
        await store.dispatch('clients/fetchClients', props.selection);
    }
});

watch(() => props.selection, resetStoreAndFetch);

watch(currentUser, (newUser) => {
    if (newUser) {
        resetStoreAndFetch();
    }
}, { immediate: true });

</script>

<template>
  <v-container>
    <ClientsTableControl
      :selection="props.selection"
      :resetPage="resetStoreAndFetch"
      @onAddClient="addClient"
    />

    <ClientModal :open="dialog"
                 @close="dialog = false"
                 :editedItem="editedItem" />

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
        <!--  //TODO  in real system hide delete button for users without permission to delete client -->
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
