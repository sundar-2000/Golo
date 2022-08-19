import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'WelcomePage',
    component: () => import('../components/WelcomPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/HomePage.vue'),
    props : true
  },
  {
    path: '/driver',
    name: 'driver',
    component: () => import('../components/DriverPage.vue')
  },
  {
    path: '/driverhome',
    name: 'driverhome',
    component: () => import('../components/DriverHome.vue'),
    props : true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
