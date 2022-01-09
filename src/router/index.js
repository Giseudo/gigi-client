import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'CloudNetwork',
    component: () => import('../scenes/CloudNetwork')
  },
  {
    path: '/server',
    name: 'InsideServer',
    component: () => import('../scenes/InsideServer')
  },
  {
    path: '/playground',
    name: 'Playground',
    component: () => import('../scenes/Playground')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
