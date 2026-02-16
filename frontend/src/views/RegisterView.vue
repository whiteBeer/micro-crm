<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router/composables';
import store from '../store';

const router = useRouter();

const username = ref('');
const email = ref('');
const role = ref('manager');
const password = ref('');
const passwordConfirm = ref('');

const error = computed(() => store.getters['user/authError']);
const loading = computed(() => store.getters['user/isLoading']);

const register = async () => {
    if (password.value !== passwordConfirm.value) {
        store.commit('user/SET_ERROR', 'Пароли не совпадают');
        return;
    }

    const success = await store.dispatch('user/register', {
        name: username.value,
        password: password.value,
        email: email.value,
        role: role.value
    });

    if (success) {
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
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="username"
                label="Имя пользователя"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                required
              ></v-text-field>
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
              <v-text-field
                id="password-confirm"
                v-model="passwordConfirm"
                label="Подтверждение пароля"
                name="password-confirm"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
              <v-select v-model="role"
                        :items="['manager', 'admin']"
                        label="Роль пользователя"
                        prepend-icon="mdi-account-card"
              ></v-select>
            </v-form>
            <v-alert v-if="error" type="error" dense text>
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="!loading"
                   to="/login"
                   color="secondary" plain>Вход</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="register" :loading="loading">Зарегистрироваться</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
