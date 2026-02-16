<script setup lang="ts">
import { ref, computed } from 'vue';
import Dashboard from '@/components/Dashboard/DashboardTable.vue';
import DashboardRecent from '@/components/Dashboard/DashboardRecent.vue';

const tabIndex = ref(0);
const selection = computed(() => (tabIndex.value === 0 ? 'my' : 'all'));
</script>

<template>
  <div>
    <v-tabs v-model="tabIndex" class="mt-4">
      <v-tab>Моя статистика</v-tab>
      <v-tab>Вся статистика</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <Dashboard :selection="selection" />
    <DashboardRecent :selection="selection" />
  </div>
</template>