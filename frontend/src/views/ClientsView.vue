<script setup lang="ts">
import Clients from '@/components/Clients/ClientsTable.vue';
import AppNavTabs from '@/components/AppNavTabs.vue';
</script>

<template>
    <v-container fluid class="pa-0 fill-height align-start">
        <v-row class="fill-height" no-gutters>
            <v-col cols="12" md="2" class="d-none d-md-block">
                <AppNavTabs />
            </v-col>
            <v-col cols="12" md="10">
                <main class="page-cont">
                    <Clients />
                </main>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>

</style>