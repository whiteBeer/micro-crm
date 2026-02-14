import axios from 'axios';
import type { ActionContext } from 'vuex';
import type { Client, ClientState, ClientInput } from '@/types/clients';
import type { RootState } from '@/types';

type ClientContext = ActionContext<ClientState, RootState>;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default {
    namespaced: true,
    state: {
        clients: [],
        loading: false,
        error: null
    } as ClientState,
    mutations: {
        SET_CLIENTS(state: ClientState, clients: Client[]) {
            state.clients = clients;
        },
        ADD_CLIENT(state: ClientState, client: Client) {
            state.clients = [client].concat(state.clients);
        },
        UPDATE_CLIENT(state: ClientState, client: Client) {
            state.clients = state.clients.map(item => item._id === client._id ? {
                ...item,
                ...client
            } : item);
        },
        DELETE_CLIENT(state: ClientState, clientId: string) {
            state.clients = state.clients.filter(client => client._id !== clientId);
        },
        SET_LOADING(state: ClientState, loading: boolean) {
            state.loading = loading;
        },
        SET_ERROR(state: ClientState, error: string | null) {
            state.error = error;
        },
        CLEAR_ERROR(state: ClientState) {
            state.error = null;
        }
    },
    actions: {
        async fetchClients({ commit, rootState }: ClientContext) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            const token = rootState.user.token;
            try {
                const response = await axios.get(`${backendUrl}/clients`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('SET_CLIENTS', response.data);
                commit('SET_LOADING', false);
                return response;
            } catch (error: any) {
                commit('SET_ERROR', error.response?.data?.msg || 'Ошибка при загрузке клиентов');
                commit('SET_LOADING', false);
            }
        },

        async createClient({ commit, rootState }: ClientContext, clientData: ClientInput) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            const token = rootState.user.token;
            try {
                const response = await axios.post(`${backendUrl}/clients`, clientData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('ADD_CLIENT', response.data.client);
                commit('SET_LOADING', false);
                return response;
            } catch (error: any) {
                commit('SET_ERROR', error.response?.data?.msg || 'Ошибка');
                commit('SET_LOADING', false);
            }
        },

        async updateClient({ commit, rootState }: ClientContext, clientData: Client) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            const token = rootState.user.token;
            try {
                const response = await axios.put(`${backendUrl}/clients/${clientData._id}`, clientData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('UPDATE_CLIENT', clientData);
                commit('SET_LOADING', false);
                return response;
            } catch (error: any) {
                commit('SET_ERROR', error.response?.data?.msg || 'Ошибка');
                commit('SET_LOADING', false);
            }
        },

        async deleteClient({ commit, rootState }: ClientContext, clientId: string) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            const token = rootState.user.token;
            try {
                const response = await axios.delete(`${backendUrl}/clients/${clientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('DELETE_CLIENT', clientId);
                commit('SET_LOADING', false);
                return response;
            } catch (error: any) {
                commit('SET_ERROR', error.response?.data?.msg || 'Ошибка при создании клиента');
                commit('SET_LOADING', false);
            }
        }
    },
    getters: {
        allClients: (state: ClientState) => state.clients,
        isLoading: (state: ClientState) => state.loading,
        error: (state: ClientState) => state.error
    }
};