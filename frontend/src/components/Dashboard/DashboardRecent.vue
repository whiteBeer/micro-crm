<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import store from '@/store';
import type {Client} from '@/types/clients';
import type {Task} from '@/types/tasks';

const props = defineProps<{
    selection: string;
}>();

const activities = ref<{
  lastUpdatedClients:Client[],
  lastUpdatedTasks: Task[]
}>({
    lastUpdatedClients: [],
    lastUpdatedTasks: []
});
const loading = ref(false);

//TODO: I do not like to put non interactive data to store
const fetchRecent = async () => {
    loading.value = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = store.state.user?.token;
    try {
        const response = await axios.get(`${backendUrl}/dashboard/recent-activities?selection=${props.selection}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        activities.value = response.data;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

watch(() => props.selection, fetchRecent, { immediate: true });

const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU');
};
</script>

<template>
  <v-container fluid class="pa-6 pt-0">
    <v-row v-if="!loading">
      <v-col cols="12" md="6">
        <v-card class="fill-height">
          <v-card-title>Последние клиенты</v-card-title>
          <v-list>
            <v-list-item v-for="client in activities.lastUpdatedClients" :key="client._id">
              <v-list-item-content>
                <v-list-item-title>
                  {{ client.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Обновлено: {{ formatDate(client.updatedAt) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="fill-height">
          <v-card-title>Последние задачи</v-card-title>
          <v-list>
            <v-list-item v-for="task in activities.lastUpdatedTasks" :key="task._id">
              <v-list-item-content>
                <v-list-item-title>
                  {{ task.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Обновлено: {{ formatDate(task.updatedAt) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>