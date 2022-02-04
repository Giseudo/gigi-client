import { GText, GButton } from './components'

export default {
  install: (app, options) => {
    app.component('GText', GText)
    app.component('GButton', GButton)
  }
}
