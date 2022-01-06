import { createApp } from 'vue'
import { TroisJSVuePlugin } from 'troisjs'
import App from './App.vue'
import router from './router'

Math.radians = (degrees) => degrees * Math.PI / 180
Math.degrees = (radians) => radians * 180 / Math.PI

createApp(App)
  .use(TroisJSVuePlugin)
  .use(router)
  .mount('#app')
