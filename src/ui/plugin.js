import {
  GButton, GInput, GModal, GText, GTouchStick
} from './components'

export default {
  install: (app) => {
    app.component('GButton', GButton)
    app.component('GInput', GInput)
    app.component('GModal', GModal)
    app.component('GText', GText)
    app.component('GTouchStick', GTouchStick)
  }
}
