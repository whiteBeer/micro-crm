<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import store from '@/store';

const props = defineProps<{
    selection: string;
    resetPage: () => void;
}>();

const search = ref('');
const error = computed(() => store.getters['clients/error']);

//TODO: make debounce in common way
let timeout:number;
watch(search, async (val: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        store.commit('clients/SET_SEARCH', val);
        store.commit('clients/SET_SKIP', 0);
        props.resetPage();
    }, 500);
});

const emit = defineEmits(['onAddClient']);
</script>

<template>
  <v-row class="mb-4">
    <v-col cols="12" sm="6">
      <v-btn :disabled="error === 'access_denied'"
             color="primary" @click="emit('onAddClient')">
        <v-icon left>mdi-plus</v-icon>
        Добавить клиента
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