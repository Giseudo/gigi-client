import { createApp } from 'vue'
import { TroisJSVuePlugin } from 'troisjs'
import App from './App.vue'
import router from './router'
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
  .mount('#app')
