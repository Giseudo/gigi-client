import { BlockMaterial, SkyboxMaterial, ProjectionMaterial } from './materials'

export default {
  install: (app) => {
    app.component('BlockMaterial', BlockMaterial)
    app.component('SkyboxMaterial', SkyboxMaterial)
    app.component('ProjectionMaterial', ProjectionMaterial)
  }
}
