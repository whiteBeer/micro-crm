<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router/composables'; // Vue 2 + Vue Router 3 composition API
import store from '../store';

const email = ref('');
const password = ref('');

const error = computed(() => store.getters['user/authError']);
const loading = computed(() => store.getters['user/isLoading']);
const router = useRouter();

const login = async () => {
    const isSuccess = await store.dispatch('user/login', {
        password: password.value,
        email: email.value
    });
    if (isSuccess) {
        router.push('/');
    }
};
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-2" variant="outlined">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Вход</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                id="password"
                v-model="password"
                label="Пароль"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
            </v-form>
            <v-alert v-if="error" type="error" dense text>
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="!loading"
                   to="/register"
                   color="secondary" plain>Регистрация</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login" :loading="loading">Войти</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
