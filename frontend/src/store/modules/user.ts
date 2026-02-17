import axios, {AxiosError} from 'axios';
import type { ActionContext } from 'vuex';
import type { User, UserState, ParamsLogin, ParamsRegister } from '@/types/user';

type UserContext = ActionContext<UserState, unknown>;

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default {
    namespaced: true,
    state: {
        user: null,
        token: localStorage.getItem('token') || '',
        error: null,
        loading: false
    } as UserState,
    mutations: {
        SET_USER(state: UserState, user: User | null) {
            state.user = user;
        },
        SET_TOKEN(state: UserState, token: string) {
            state.token = token;
        },
        SET_ERROR(state: UserState, error: string | null) {
            state.error = error;
        },
        CLEAR_ERROR(state: UserState) {
            state.error = null;
        },
        SET_LOADING(state: UserState, loading: boolean) {
            state.loading = loading;
        },
    },
    actions: {

        async login({ commit }: UserContext, credentials: ParamsLogin) {
            commit('CLEAR_ERROR');
            commit('SET_LOADING', true);
            try {
                const response = await axios.post(`${backendUrl}/auth/login`, credentials);

                const token = response.data.token;
                const user = response.data.user;

                localStorage.setItem('token', token);

                commit('SET_TOKEN', token);
                commit('SET_USER', user);

                commit('SET_LOADING', false);
                return true;
            } catch (e:unknown) {
                const error = e as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
                return false;
            }
        },

        async register({ commit }: UserContext, userData: ParamsRegister) {
            commit('CLEAR_ERROR');
            commit('SET_LOADING', true);
            try {
                const response = await axios.post(`${backendUrl}/auth/register`, userData);

                const token = response.data.token;
                const user = response.data.user;

                localStorage.setItem('token', token);

                commit('SET_TOKEN', token);
                commit('SET_USER', user);

                commit('SET_LOADING', false);
                return true;
            } catch (e:unknown) {
                const error = e as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
                return false;
            }
        },

        async updateUser({ commit, state }: UserContext, userData: Partial<User>) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            try {
                const response = await axios.put(`${backendUrl}/users/profile`, userData, {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                });
                commit('SET_USER', response.data.user);
                commit('SET_LOADING', false);
                return true;
            } catch (e:unknown) {
                const error = e as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
                return false;
            }
        },

        async fetchUser({ commit, state }: UserContext) {
            if (!state.token) {
                return;
            }
            try {
                const response = await axios.get(`${backendUrl}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                });
                commit('SET_USER', response.data.user);
            } catch (e) {
                const error = e as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
            }
        },

        async logout({ commit, state }: UserContext) {
            try {
                await axios.post(`${backendUrl}/auth/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                });
                localStorage.removeItem('token');
                commit('SET_TOKEN', '');
                commit('SET_USER', null);
                commit('SET_ERROR', null);
                commit('clients/SET_DEFAULT_STATE', null, { root: true });
                commit('tasks/SET_DEFAULT_STATE', null, { root: true });
            } catch (e) {
                const error = e as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
            }
        }
    },
    getters: {
        isAuthenticated: (state: UserState) => !!state.token,
        isAdmin: (state: UserState) => state.user?.role === 'admin',
        currentUser: (state: UserState) => state.user,
        authError: (state: UserState) => state.error,
        isLoading: (state: UserState) => state.loading
    }
};