<script setup lang="ts">
import { ref, computed } from 'vue';
import TasksTable from '@/components/Tasks/TasksTable.vue';
import store from '@/store';

const tabIndex = ref(0);
const selection = computed(() => (tabIndex.value === 0 ? 'my' : 'all'));
const currentUser = computed(() => store.getters['user/currentUser']);
</script>

<template>
  <div>
    <v-tabs v-model="tabIndex" class="mt-4">
      <v-tab class="justify-start pl-8">Мои задачи</v-tab>
      <v-tab class="justify-start pl-8">
        Все задачи
      </v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <TasksTable :selection="selection" />
  </div>
</template>