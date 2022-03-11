import { createApp } from 'vue'
import { TroisJSVuePlugin } from 'troisjs'
import UIPlugin from './ui/plugin'
import WorldPlugin from './world/plugin'
import ProvidersPlugin from './providers/plugin.js'
import App from './App.vue'
import router from './router'
import './styles/fonts.scss'
import './socket/socket'

Math.radians = (degrees) => degrees * Math.PI / 180
Math.degrees = (radians) => radians * 180 / Math.PI
Math.lerp = (value1, value2, amount) => {
  amount = amount < 0 ? 0 : amount
  amount = amount > 1 ? 1 : amount

  return value1 + (value2 - value1) * amount
}
Math.mod = (n, m) => ((n % m) + m) % m
Math.TAU = Math.PI * 2

createApp(App)
  .use(TroisJSVuePlugin)
  .use(router)
  .use(ProvidersPlugin)
  .use(UIPlugin)
  .use(WorldPlugin)
  .mount('#app')
