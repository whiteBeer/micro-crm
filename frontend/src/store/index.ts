import Vue from 'vue';
import Vuex from 'vuex';
import clients from './modules/clients';
import user from './modules/user';
import type { UserState } from '@/types/user';

Vue.use(Vuex);

export interface RootState {
    user: UserState;
    clients: any;
}

export default new Vuex.Store<RootState>({
    modules: {
        clients,
        user
    }
});