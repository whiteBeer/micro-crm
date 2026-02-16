<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppWelcome from '@/components/AppWelcome.vue';
import AppSnackbar from '@/components/AppSnackbar.vue';
import { computed } from 'vue';
import store from '@/store';

const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);
</script>

<template>
  <v-app>
    <div id="app">
      <AppHeader />
      <template v-if="isAuthenticated">
        <v-main>
          <router-view />
        </v-main>
      </template>
      <template v-else>
        <v-main>
          <router-view v-if="['/login', '/register'].includes($route.path)" />
          <AppWelcome v-else />
        </v-main>
      </template>
      <AppSnackbar />
    </div>
  </v-app>
</template>

<style scoped>

</style>
