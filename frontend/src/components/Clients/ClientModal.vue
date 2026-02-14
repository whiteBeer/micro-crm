<script setup lang="ts">
import { computed } from 'vue';
import store from '../../store';
import type {ClientInput} from '@/types/clients';

const props = defineProps<{
  value: boolean;
  editedItem: ClientInput;
}>();

const emit = defineEmits(['input']);

const statusOptions = ['active', 'inactive', 'lead'];

const error = computed(() => store.getters['clients/error']);

const close = () => {
    store.commit('clients/CLEAR_ERROR');
    emit('input', false);
};

const save = async () => {
    const clearedData:any = Object.keys(props.editedItem)
        .filter((k) => !!props.editedItem[k])
        .reduce((a, k) => ({ ...a, [k]: props.editedItem[k] }), {});
    let success;
    if (clearedData._id) {
        success = await store.dispatch('clients/updateClient', clearedData);
    } else {
        success = await store.dispatch('clients/createClient', clearedData);
    }
    if (success) {
        close();
    }
};
</script>

<template>
  <v-dialog :value="value" @input="emit('input', $event)" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Новый клиент</span>
      </v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error" dense text class="mb-4">
          {{ error }}
        </v-alert>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12">
              <v-text-field v-model="editedItem.name" label="Имя"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedItem.phone" label="Телефон"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field v-model="editedItem.company" label="Компания"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-select v-model="editedItem.status" :items="statusOptions" label="Статус"></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="editedItem.notes" label="Заметки" rows="3"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
        <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>