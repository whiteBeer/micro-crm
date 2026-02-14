import axios, { AxiosError } from 'axios';
import type { ActionContext } from 'vuex';
import type { Client, ClientState, ClientInput } from '@/types/clients';
import type { RootState } from '@/types';

type ClientContext = ActionContext<ClientState, RootState>;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default {
    namespaced: true,
    state: {
        clients: [],
        total: 0,
        skip: 0,
        limit: 5,
        search: '',
        loading: false,
        error: null
    } as ClientState,
    mutations: {
        SET_CLIENTS(state: ClientState, clients: Client[]) {
            state.clients = clients;
        },
        SET_TOTAL(state: ClientState, totalClients: number) {
            state.total = totalClients;
        },
        SET_SEARCH(state: ClientState, search: string) {
            state.search = search;
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
        SET_SKIP(state: ClientState, skip: number) {
            state.skip = skip;
        },
        SET_LIMIT(state: ClientState, limit: number) {
            state.limit = limit;
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
                const limit = rootState.clients.limit;
                const skip = rootState.clients.skip;
                const search = rootState.clients.search;
                const url = `${backendUrl}/clients?limit=${limit}&skip=${skip}&search=${search}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('SET_CLIENTS', response.data.clients);
                commit('SET_TOTAL', response.data.total);
                commit('SET_LOADING', false);
                return response;
            } catch (err:unknown) {
                const error = err as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
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
                commit('SET_TOTAL', rootState.clients.total + 1);
                commit('SET_LOADING', false);
                return response;
            } catch (err:unknown) {
                const error = err as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
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
            } catch (err:unknown) {
                const error = err as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
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
                commit('SET_TOTAL', rootState.clients.total - 1);
                commit('SET_LOADING', false);
                return response;
            } catch (err:unknown) {
                const error = err as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
            }
        }
    },
    getters: {
        allClients: (state: ClientState) => state.clients,
        limit: (state: ClientState) => state.limit,
        total: (state: ClientState) => state.total,
        isLoading: (state: ClientState) => state.loading,
        error: (state: ClientState) => state.error
    }
};