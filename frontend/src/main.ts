import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store';

import { showSnackbarMessage } from '@/components/AppSnackbar.vue';
import './assets/main.css';

Vue.use(Vuetify);

const vuetify = new Vuetify();

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch('user/logout');
        }
        if (error.response && error.response.status === 403) {
            showSnackbarMessage({
                text: error.response.data.msg || 'access_denied',
                color: 'error'
            });
        }
        if (error.response && error.response.status === 405) {
            store.dispatch('user/logout');
        }
        return Promise.reject(error);
    }
);

if (store.state.user.token) {
    store.dispatch('user/fetchUser');
}

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App)
}).$mount('#app');
