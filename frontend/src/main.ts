import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

import App from './App.vue';
import router from './router';
import store from './store';

import './assets/main.css';

Vue.use(Vuetify);

const vuetify = new Vuetify();

if (store.state.user.token) {
    store.dispatch('user/fetchUser');
}

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App)
}).$mount('#app');
