import { createRouter, createWebHistory } from 'vue-router';
const Login = () => import('~/pages/Login.vue')
const Dashboard = () => import('~/pages/Dashboard.vue');
const Upitnik = () => import('~/pages/Upitnik.vue')

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: true
  },
  {
    path: '/upitnik',
    name: 'Upitnici',
    component: Upitnik,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
