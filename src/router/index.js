import { createRouter, createWebHistory } from 'vue-router'
import CloudNetwork from '../world/scenes/CloudNetwork.vue'
import InsideServer from '../world/scenes/InsideServer.vue'
import Playground from '../world/scenes/Playground.vue'
import { APIGateway } from '../world/scenes/APIGateway'

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
  },
  {
    path: '/gateway',
    name: 'APIGateway',
    component: APIGateway,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
