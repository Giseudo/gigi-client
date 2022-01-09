import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Cloud',
    component: () => import('../scenes/Cloud.vue')
  },
  {
    path: '/server',
    name: 'InsideServer',
    component: () => import('../scenes/InsideServer.vue')
  },
  {
    path: '/playground',
    name: 'Playground',
    component: () => import('../scenes/Playground.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
