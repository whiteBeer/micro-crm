<script setup lang="ts">
import { ref, computed } from 'vue';
import TasksTable from '@/components/Tasks/TasksTable.vue';
import TasksKanban from '@/components/Tasks/TasksKanban.vue';

const tabIndex = ref(0);
const selection = computed(() => (tabIndex.value === 0 ? 'my' : 'all'));
const viewMode = ref('list');
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
    
    <div class="d-flex justify-end px-4 mt-2">
      <v-btn-toggle v-model="viewMode" mandatory dense color="primary">
        <v-btn value="list">
          <v-icon left>mdi-format-list-bulleted</v-icon>
          Список задач
        </v-btn>
        <v-btn value="kanban">
          <v-icon left>mdi-view-column</v-icon>
          Канбан доска
        </v-btn>
      </v-btn-toggle>
    </div>

    <TasksTable v-if="viewMode === 'list'" :selection="selection" />
    <TasksKanban v-if="viewMode === 'kanban'" :selection="selection" />
  </div>
</template>