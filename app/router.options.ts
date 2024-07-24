import type { RouterConfig } from '@nuxt/schema'

const Login = () => import('~/pages/Login.vue')
const Dashboard = () => import('~/pages/Dashboard.vue')
const Upitnik = () => import('~/pages/Upitnik.vue')

export default <RouterConfig>{
  routes: (_routes) => [
    {
      name: 'Dashboard',
      path: '/',
      component: Dashboard,
      props: true,
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
    {
      path: '/:pathMatch(.*)*',
      component: () => import('~/pages/NotFound.vue'),
      props: true,
      name: 'NotFound'
    }
  ],
}
