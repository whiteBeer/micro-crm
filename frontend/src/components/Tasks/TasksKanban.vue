<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TaskModal from './TaskModal.vue';
import TasksTableControl from './TasksTableControl.vue';
import TasksKanbanItem from './TasksKanbanItem.vue';
import store from '@/store';
import type { Task } from '@/types/tasks';
import {getStatusColor} from './util/getStatusColor';

const props = defineProps<{
    selection: string;
}>();

const dialog = ref(false);
const editedItem = ref<Task | null>(null);

const tasks = computed(() => store.getters['tasks/allTasks']);
const loading = computed(() => store.getters['tasks/isLoading']);
const error = computed(() => store.getters['tasks/error']);
const currentUser = computed(() => store.getters['user/currentUser']);

const statuses = ['pending', 'in_progress', 'completed'];

const getTasksByStatus = (status: string) => {
    return tasks.value.filter((t: Task) => t.status === status);
};

const addTask = () => {
    editedItem.value = null;
    dialog.value = true;
};

const editTask = (item: Task) => {
    editedItem.value = item;
    dialog.value = true;
};

const deleteTask = async (item: Task) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        await store.dispatch('tasks/deleteTask', item._id);
    }
};

const fetchTasks = async () => {
    //TODO: in real CRM it should be restricted by projectId and !backlog status
    store.commit('tasks/SET_LIMIT', 100);
    store.commit('tasks/SET_SKIP', 0);
    if (currentUser.value) {
        await store.dispatch('tasks/fetchTasks', props.selection);
    }
};

const resetStoreAndFetch = async () => {
    store.commit('tasks/SET_TASKS', []);
    await fetchTasks();
};

watch(() => props.selection, resetStoreAndFetch);

watch(currentUser, (newUser) => {
    if (newUser) {
        resetStoreAndFetch();
    }
}, { immediate: true });
</script>

<template>
  <v-container>
    <TasksTableControl
        :selection="props.selection"
        :resetPage="fetchTasks"
        @onAddTask="addTask"
    />
    <TaskModal :open="dialog" @close="dialog = false" :editedItem="editedItem" />

    <v-alert v-if="error === 'access_denied'" type="error" dense text class="mb-4">
        {{ error }}
    </v-alert>

    <v-row v-if="error !== 'access_denied'">
        <v-col cols="12" md="4" v-for="status in statuses" :key="status">
            <v-card class="fill-height" color="grey lighten-4">
                <v-card-title class="subtitle-1 font-weight-bold">
                    <v-chip :color="getStatusColor(status)" dark small>
                        {{ status }}
                    </v-chip>
                </v-card-title>
                <v-card-text>
                    <div v-if="loading" class="text-center pa-4">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div v-if="!loading">
                        <TasksKanbanItem
                            v-for="task in getTasksByStatus(status)"
                            :key="task._id"
                            :task="task"
                            @edit="editTask"
                            @delete="deleteTask"
                        />
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>