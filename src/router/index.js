import { createRouter, createWebHistory } from 'vue-router'
import { worldRoutes } from '../world'
import Playground from '../world/scenes/Playground.vue'

const routes = [
  {
    path: '/playground',
    name: 'Playground',
    component: Playground,
  },
  ...worldRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
