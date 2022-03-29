import {
  BlockMaterial, SkyboxMaterial, ProjectionMaterial,
  StripesMaterial
} from './materials'

export default {
  install: (app) => {
    app.component('BlockMaterial', BlockMaterial)
    app.component('SkyboxMaterial', SkyboxMaterial)
    app.component('ProjectionMaterial', ProjectionMaterial)
    app.component('StripesMaterial', StripesMaterial)
  }
}
