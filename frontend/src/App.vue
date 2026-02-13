<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <v-app>
    <div id="app">
      <AppHeader />

      <v-main>
        <router-view />
      </v-main>
    </div>
  </v-app>
</template>

<style scoped>

</style>
