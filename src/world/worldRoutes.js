import { cloudRoutes } from './scenes/Cloud'
import { serverRoutes } from './scenes/Server'
import { systemRoutes } from './scenes/System'

export const worldRoutes = [
  ...cloudRoutes,
  ...serverRoutes,
  ...systemRoutes
]
