import Server from './Server.vue'
import Gateway from './Gateway/Gateway.vue'

export const serverRoutes = [
  {
    path: '/server',
    name: 'Server',
    component: Server,
    children: [
      {
        path: 'gateway',
        name: 'ServerGateway',
        component: Gateway,
      }
    ]
  }
]
