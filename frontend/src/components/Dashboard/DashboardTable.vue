<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import store from '@/store';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
    selection: string;
}>();

const stats = ref({
    clientsCount: 0,
    tasksCountPending: 0,
    tasksCountInProgress: 0,
    tasksCountCompleted: 0,
    tasksCountAll: 0
});
const loading = ref(false);
const error = ref('');

//TODO: I do not like to put non interactive data to store
const fetchStats = async () => {
    loading.value = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = store.state.user?.token;
    try {
        const response = await axios.get(`${backendUrl}/dashboard?selection=${props.selection}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = response.data;
        stats.value = {
            ...data,
            tasksCountAll: data.tasksCountPending + data.tasksCountInProgress + data.tasksCountCompleted
        };
        error.value = '';
    } catch (e) {
        error.value = 'server_error';
    } finally {
        loading.value = false;
    }
};

const chartData = computed(() => {
    return {
        labels: ['pending', 'in_progress', 'completed'],
        datasets: [
            {
                backgroundColor: ['#FB8C00', '#039BE5', '#43A047'],
                data: [
                    stats.value.tasksCountPending,
                    stats.value.tasksCountInProgress,
                    stats.value.tasksCountCompleted
                ]
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
};

watch(() => props.selection, fetchStats, { immediate: true });

</script>

<template>
  <div>
    <v-container v-if="!loading && !error" fluid class="pa-6">
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-4 fill-height">
            <div class="text-subtitle-1 mb-2">Количество клиентов</div>
            <div class="text-h2 font-weight-bold">{{ stats.clientsCount }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4 fill-height">
            <div class="text-subtitle-1 mb-2">Количество задач</div>
            <div class="text-h2 font-weight-bold">{{ stats.tasksCountAll }}</div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-card class="pa-4 diagram-cont">
            <div v-if="loading" class="d-flex justify-center align-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else class="pie-cont">
              <Pie :data="chartData" :options="chartOptions" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div v-if="loading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>

<style scoped>
  .diagram-cont {
    min-height: 300px;
  }
  .pie-cont {
    height: 300px;
    position: relative;
  }
</style>