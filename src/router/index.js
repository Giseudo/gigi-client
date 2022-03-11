import { createRouter, createWebHistory } from 'vue-router'
import { worldRoutes } from '../world'

const routes = [
  ...worldRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
