<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import store from '@/store';
import type { User } from '@/types/user';
import { showSnackbarMessage } from '@/components/AppSnackbar.vue';
import { i18n } from '@/utils/localization';

const currentUser = computed<User | null>(() => store.getters['user/currentUser']);
const loading = computed(() => store.getters['user/isLoading']);
const error = computed(() => store.getters['user/authError']);

const name = ref('');
const email = ref('');

const saveProfile = async () => {
    const success = await store.dispatch('user/updateUser', {
        name: name.value,
        email: email.value
    });
    if (success) {
        showSnackbarMessage({ text: 'Профиль успешно обновлен', color: 'success' });
    } else {
        showSnackbarMessage({ text: error.value, color: 'error' });
    }
};

watch(currentUser, (newUser) => {
    if (newUser) {
        name.value = newUser.name;
        email.value = newUser.email;
    }
}, { immediate: true });
</script>

<template>
  <v-card class="elevation-2">
    <v-card-title class="text-h5">
      Редактирование профиля
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="saveProfile">
        <v-text-field
          v-model="name"
          label="Имя"
          prepend-icon="mdi-account"
          required
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="Email"
          prepend-icon="mdi-email"
          type="email"
          required
        ></v-text-field>
      </v-form>
      <v-alert v-if="error" type="error" dense text class="mt-4">{{ i18n(error) }}</v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="saveProfile" :loading="loading">Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>