<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import store from '@/store';

const props = defineProps<{
    selection: string;
    resetPage: () => void;
}>();

const search = ref('');
const error = computed(() => store.getters['tasks/error']);

let timeout: any;
watch(search, (val: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        store.commit('tasks/SET_SEARCH', val);
        store.commit('tasks/SET_SKIP', 0);
        props.resetPage();
    }, 500);
});

const emit = defineEmits(['onAddTask']);
</script>

<template>
  <v-row class="mb-4">
    <v-col cols="12" sm="6">
      <v-btn :disabled="error === 'access_denied'"
             color="primary" @click="emit('onAddTask')">
        <v-icon left>mdi-plus</v-icon>
        Добавить задачу
      </v-btn>
    </v-col>

    <v-col cols="12" sm="6">
      <v-text-field
          :disabled="error === 'access_denied'"
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
      ></v-text-field>
    </v-col>
  </v-row>
</template>