<script lang="ts">
import Vue from 'vue';

const snackbarState = Vue.observable({
    visible: false,
    text: '',
    color: 'info'
});

export const showSnackbarMessage = (payload: { text: string, color?: string }) => {
    snackbarState.text = payload.text;
    snackbarState.color = payload.color || 'info';
    snackbarState.visible = true;
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

const snackbar = snackbarState;

const snackbarVisible = computed({
    get: () => snackbar.visible,
    set: (val) => { snackbar.visible = val; }
});
</script>

<template>
  <v-snackbar v-model="snackbarVisible" :color="snackbar.color" top right :timeout="5000">
    {{ snackbar.text }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbarVisible = false">Закрыть</v-btn>
    </template>
  </v-snackbar>
</template>