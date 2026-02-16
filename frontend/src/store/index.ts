import Vue from 'vue';
import Vuex from 'vuex';
import clients from './modules/clients';
import user from './modules/user';
import tasks from './modules/tasks';
import type { RootState } from '@/types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    modules: {
        clients,
        user,
        tasks
    }
});