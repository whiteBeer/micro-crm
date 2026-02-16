import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: import.meta.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterView.vue')
    },
    {
        path: '/clients',
        name: 'clients',
        component: () => import('../views/ClientsView.vue')
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: () => import('../views/TasksView.vue')
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
