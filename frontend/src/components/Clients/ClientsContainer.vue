<script setup lang="ts">
import { ref } from 'vue';
import ClientsTable from '@/components/Clients/ClientsTable.vue';

const tab = ref('my');
</script>

<template>
  <div>
    <!--  //TODO  in real system hide tabs for users without permission to see all clients -->
    <v-tabs class="mt-4">
      <v-tab class="justify-start pl-8" @click="tab = 'my'">Мои клиенты</v-tab>
      <v-tab class="justify-start pl-8" @click="tab = 'all'">Все клиенты</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <ClientsTable :selection="tab" />
  </div>
</template>