import {
  ThemeProvider, NavmeshProvider
} from './'

export default {
  install: (app) => {
    app.component('ThemeProvider', ThemeProvider)
    app.component('NavmeshProvider', NavmeshProvider)
  }
}
