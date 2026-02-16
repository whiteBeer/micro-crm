<script setup lang="ts">
import type { Task } from '@/types/tasks';
import {getPriorityColor} from './util/getPriorityColor';

defineProps<{
    task: Task;
}>();

const emit = defineEmits(['edit', 'delete']);

</script>

<template>
  <v-card class="mb-3 elevation-1 white">
    <v-card-title class="subtitle-2 pb-0">{{ task.title }}</v-card-title>
    <v-card-text class="caption pt-1">
      <div v-if="task.client && task.client.name" class="mb-1">
        <v-icon x-small>mdi-account</v-icon> {{ task.client.name }}
      </div>
      <div v-if="task.dueDate" class="mb-1">
        <v-icon x-small>mdi-calendar</v-icon> {{ task.dueDate }}
      </div>
      <div v-if="task.priority">
        <v-chip x-small :color="getPriorityColor(task.priority)" dark>{{ task.priority }}</v-chip>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon x-small @click="emit('edit', task)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon x-small @click="emit('delete', task)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>