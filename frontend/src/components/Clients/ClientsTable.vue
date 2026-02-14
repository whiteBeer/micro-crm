<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ClientModal from './ClientModal.vue';
import store from '@/store';
import type {Client, ClientInput} from '@/types/clients';

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

const defaultItem:ClientInput = {
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    status: 'lead'
};

const editedItem = ref({ ...defaultItem });

onMounted(() => {
    store.dispatch('clients/fetchClients');
});

const addClient = () => {
    editedItem.value = { ...defaultItem };
    dialog.value = true;
};

const close = () => {
    dialog.value = false;
};

const save = (editedClient:Client) => {
    if (editedClient) {
        alert(1);
    }
    close();
};

const editClient = (item:Client) => {
    editedItem.value = { ...item };
    dialog.value = true;
};

const deleteClient = async (item:Client) => {
    await store.dispatch('clients/deleteClient', item._id);
};
</script>

<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-btn color="primary" @click="addClient">
          <v-icon left>mdi-plus</v-icon>
          Добавить клиента
        </v-btn>
      </v-col>

      <ClientModal v-model="dialog" :editedItem="editedItem" @save="save" />

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="clients"
      :search="search"
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
