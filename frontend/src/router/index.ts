import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import Clients from '../components/Clients/ClientsTable.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: import.meta.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/clients',
        name: 'clients',
        component: Clients
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue')
    },
    {
        path: '/profile-edit',
        name: 'profile-edit',
        component: () => import('../views/ProfileEditView.vue')
    }]
});

export default router;
