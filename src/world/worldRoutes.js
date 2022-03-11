import { cloudRoutes } from './scenes/Cloud'
import { playgroundRoutes } from './scenes/Playground'
import { serverRoutes } from './scenes/Server'
import { systemRoutes } from './scenes/System'

export const worldRoutes = [
  ...cloudRoutes,
  ...playgroundRoutes,
  ...serverRoutes,
  ...systemRoutes
]
