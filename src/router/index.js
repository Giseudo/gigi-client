import { createRouter, createWebHistory } from 'vue-router'
import CloudNetwork from '../scenes/CloudNetwork.vue'
import InsideServer from '../scenes/InsideServer.vue'
import Playground from '../scenes/Playground.vue'

const routes = [
  {
    path: '/',
    name: 'CloudNetwork',
    component: CloudNetwork,
  },
  {
    path: '/server',
    name: 'InsideServer',
    component: InsideServer,
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Playground,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
