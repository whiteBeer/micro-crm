import axios from 'axios';

export default {
    namespaced: true,
    state: {
        clients: []
    },
    mutations: {
        SET_CLIENTS(state: any, clients: any[]) {
            state.clients = clients;
        },
        ADD_CLIENT(state: any, client: any) {
            state.clients.push(client);
        }
    },
    actions: {
        async fetchClients({ commit }: any) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            try {
                const response = await axios.get(`${backendUrl}/clients`);
                commit('SET_CLIENTS', response.data);
                return response;
            } catch (error) {
                console.error('Ошибка при загрузке клиентов:', error);
                throw error;
            }
        },
        async createClient({ commit }: any, clientData: any) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(`${backendUrl}/clients`, clientData);
            commit('ADD_CLIENT', response.data);
            return response;
        }
    },
    getters: {
        allClients: (state: any) => state.clients
    }
};