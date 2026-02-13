<script setup lang="ts">

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router/composables';
import store from '../store';

const drawer = ref(false);
const currentUser = computed(() => store.getters['user/currentUser']);
const router = useRouter();

const logout = () => {
    store.dispatch('user/logout');
    router.push('/login');
};

</script>

<template>
  <div id="header">
    <v-app-bar
        class="elevation-2"
        color="primary"
        dense
        dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Micro CRM</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        temporary
        app
    >
      <v-list v-if="currentUser">
        <v-list-item>
          <v-list-item-avatar>
            <img :src="`/img/${currentUser.avatar}`" :alt="currentUser.name">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider v-if="currentUser"></v-divider>

      <v-list>
        <v-list-item v-if="!currentUser" value="login" to="/login">
          <v-list-item-content>
            <v-list-item-title>Вход</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!currentUser" value="register" to="/register">
          <v-list-item-content>
            <v-list-item-title>Регистрация</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="currentUser" value="board" to="/">
          <v-list-item-content>
            <v-list-item-title>Доска задач</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="currentUser" value="profile" to="/profile-edit" color="primary">
          <v-list-item-content>
            <v-list-item-title>Редактирование профиля</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item value="about" to="/about" color="primary">
          <v-list-item-content>
            <v-list-item-title>О приложении</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="currentUser"></v-divider>

      </v-list>

      <div v-if="currentUser" class="d-flex justify-center pa-4">
        <v-btn color="secondary" outlined @click="logout">Выход</v-btn>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>

</style>
