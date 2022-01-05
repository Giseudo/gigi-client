import { createApp } from 'vue'
import { TroisJSVuePlugin } from 'troisjs'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(TroisJSVuePlugin)
  .use(router)
  .mount('#app')
