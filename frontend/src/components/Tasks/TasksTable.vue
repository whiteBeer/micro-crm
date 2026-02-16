<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TaskModal from './TaskModal.vue';
import TasksTableControl from './TasksTableControl.vue';
import store from '@/store';
import type { Task } from '@/types/tasks';

interface ITableOptions {
    page: number;
    itemsPerPage: number;
}

const props = defineProps<{
    selection: string;
}>();

const dialog = ref(false);
const headers = [
    { text: 'Заголовок', value: 'title', sortable: false },
    { text: 'Клиент', value: 'client.name', sortable: false },
    { text: 'Статус', value: 'status', sortable: false },
    { text: 'Приоритет', value: 'priority', sortable: false },
    { text: 'Срок', value: 'dueDate', sortable: false },
    { text: 'Действия', value: 'actions', sortable: false },
];
const tasks = computed(() => store.getters['tasks/allTasks']);
const total = computed(() => store.getters['tasks/total']);
const limit = computed(() => store.getters['tasks/limit']);
const loading = computed(() => store.getters['tasks/isLoading']);
const error = computed(() => store.getters['tasks/error']);
const currentUser = computed(() => store.getters['user/currentUser']);

const options = ref<ITableOptions>({page: 1, itemsPerPage: limit.value});

const editedItem = ref<Task | null>(null);

const addTask = () => {
    editedItem.value = null;
    dialog.value = true;
};

const editTask = (item: Task) => {
    editedItem.value = item;
    dialog.value = true;
};

const resetStoreAndFetch = async () => {
    store.commit('tasks/SET_TASKS', []);
    store.commit('tasks/SET_LOADING', true);
    store.commit('tasks/SET_SKIP', 0);
    if (options.value.page !== 1) {
        options.value = { ...options.value, page: 1 };
    } else if (currentUser.value) {
        await store.dispatch('tasks/fetchTasks', props.selection);
    }
};

const deleteTask = async (item: Task) => {
    if (confirm('Вы уверены, что хотите удалить задачу?')) {
        await store.dispatch('tasks/deleteTask', item._id);
    }
};

watch(options, async (newOptions: ITableOptions, oldOptions: ITableOptions) => {
    const { page, itemsPerPage } = newOptions;
    if (page !== oldOptions.page || itemsPerPage !== oldOptions.itemsPerPage) {
        const skip = (page - 1) * itemsPerPage;
        store.commit('tasks/SET_LIMIT', itemsPerPage);
        store.commit('tasks/SET_SKIP', skip);
        if (currentUser.value) {
            await store.dispatch('tasks/fetchTasks', props.selection);
        }
    }
});

watch(() => props.selection, resetStoreAndFetch);

watch(currentUser, (newUser) => {
    if (newUser && tasks.value.length === 0) {
        resetStoreAndFetch();
    }
}, { immediate: true });

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return 'orange';
        case 'in_progress': return 'blue';
        case 'completed': return 'green';
        default: return 'grey';
    }
};
</script>

<template>
  <v-container>
    <TasksTableControl
        :selection="props.selection"
        :resetPage="resetStoreAndFetch"
        @onAddTask="addTask"
    />

    <TaskModal :open="dialog"
                 @close="dialog = false"
                 :editedItem="editedItem" />

    <v-alert v-if="error === 'access_denied'" type="error" dense text class="mb-4">
        {{ error }}
    </v-alert>
    <v-data-table
      :headers="headers"
      :items="tasks"
      :server-items-length="total"
      :options.sync="options"
      :loading="loading"
      :footer-props="{
          'items-per-page-options': [2, 5, 10, 50],
          'items-per-page-text': 'Задач на странице'
      }"
      :items-per-page="limit"
      v-if="error !== 'access_denied'"
      class="elevation-1"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark small>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editTask(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteTask(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>