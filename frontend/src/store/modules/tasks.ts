import axios, { AxiosError } from 'axios';
import type { ActionContext } from 'vuex';
import type {Task, TaskState, TaskInput, TaskEdit} from '@/types/tasks';
import type { RootState } from '@/types';
import type {ClientState} from '@/types/clients';

type TaskContext = ActionContext<TaskState, RootState>;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const defaultState:TaskState = {
    tasks: [],
    total: 0,
    skip: 0,
    limit: 5,
    search: '',
    loading: false,
    error: null
};

export default {
    namespaced: true,
    state: defaultState,
    mutations: {
        SET_DEFAULT_STATE(state: ClientState) {
            Object.assign(state, defaultState);
        },
        SET_TASKS(state: TaskState, tasks: Task[]) {
            state.tasks = tasks;
        },
        SET_TOTAL(state: TaskState, total: number) {
            state.total = total;
        },
        SET_SEARCH(state: TaskState, search: string) {
            state.search = search;
        },
        ADD_TASK(state: TaskState, task: Task) {
            state.tasks = [task].concat(state.tasks);
        },
        UPDATE_TASK(state: TaskState, task: Task) {
            state.tasks = state.tasks.map(item => item._id === task._id ? {
                ...item,
                ...task
            } : item);
        },
        DELETE_TASK(state: TaskState, taskId: string) {
            state.tasks = state.tasks.filter(task => task._id !== taskId);
        },
        SET_LOADING(state: TaskState, loading: boolean) {
            state.loading = loading;
        },
        SET_SKIP(state: TaskState, skip: number) {
            state.skip = skip;
        },
        SET_LIMIT(state: TaskState, limit: number) {
            state.limit = limit;
        },
        SET_ERROR(state: TaskState, error: string | null) {
            state.error = error;
        },
        CLEAR_ERROR(state: TaskState) {
            state.error = null;
        }
    },
    actions: {
        async fetchTasks({ commit, rootState }: TaskContext, selection: string) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            const token = rootState.user.token;
            try {
                const limit = rootState.tasks.limit;
                const skip = rootState.tasks.skip;
                const search = rootState.tasks.search;
                const url = `${backendUrl}/tasks?limit=${limit}&skip=${skip}&search=${search}&selection=${selection}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('SET_TASKS', response.data.tasks);
                commit('SET_TOTAL', response.data.total);
                commit('SET_LOADING', false);
                return response;
            } catch (err:unknown) {
                const error = err as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
            }
        },

        async createTask({ commit, rootState }: TaskContext, taskData: TaskEdit) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            const token = rootState.user.token;
            try {
                const response = await axios.post(`${backendUrl}/tasks`, taskData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('ADD_TASK', {
                    ...response.data.task,
                    client: taskData.client
                });
                commit('SET_TOTAL', rootState.tasks.total + 1);
                commit('SET_LOADING', false);
                return response;
            } catch (err:unknown) {
                const error = err as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
            }
        },

        async updateTask({ commit, rootState }: TaskContext, taskData: Task) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            const token = rootState.user.token;
            try {
                const response = await axios.put(`${backendUrl}/tasks/${taskData._id}`, taskData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('UPDATE_TASK', taskData);
                commit('SET_LOADING', false);
                return response;
            } catch (err:unknown) {
                const error = err as AxiosError<{ msg: string }>;
                commit('SET_ERROR', error.response?.data?.msg || 'unknown_error');
                commit('SET_LOADING', false);
            }
        },

        async deleteTask({ commit, rootState }: TaskContext, taskId: string) {
            commit('SET_LOADING', true);
            commit('CLEAR_ERROR');
            const token = rootState.user.token;
            try {
                const response = await axios.delete(`${backendUrl}/tasks/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('DELETE_TASK', taskId);
                commit('SET_TOTAL', rootState.tasks.total - 1);
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
        allTasks: (state: TaskState) => state.tasks,
        limit: (state: TaskState) => state.limit,
        total: (state: TaskState) => state.total,
        isLoading: (state: TaskState) => state.loading,
        error: (state: TaskState) => state.error
    }
};