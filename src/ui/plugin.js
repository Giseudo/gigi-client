import {
  GButton, GInput, GModal, GText
} from './components'

export default {
  install: (app, options) => {
    app.component('GButton', GButton)
    app.component('GInput', GInput)
    app.component('GModal', GModal)
    app.component('GText', GText)
  }
}
