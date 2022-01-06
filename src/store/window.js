import { inject, provide, ref } from 'vue'

const queries = {
  xsMobile: window.matchMedia('screen and (max-width: 576px)'),
  mobile: window.matchMedia('screen and (max-width: 1023px)'),
  tablet: window.matchMedia('screen and (max-width: 1279px)'),
}

const isXsMobile = ref(false)
const isMobile = ref(false)
const isTablet = ref(false)

const setBreakpoint = () => {
  isMobile.value = queries.mobile && queries.mobile.matches
  isXsMobile.value = queries.xsMobile && queries.xsMobile.matches
  isTablet.value = queries.tablet && queries.tablet.matches
}

export const initWindow = () => {
  queries.tablet.addEventListener('change', setBreakpoint)
  queries.mobile.addEventListener('change', setBreakpoint)
  queries.xsMobile.addEventListener('change', setBreakpoint)

  provide('window/isXsMobile', isXsMobile)
  provide('window/isMobile', isMobile)
  provide('window/isTablet', isTablet)

  setBreakpoint()
}

export const destroyWindow = () => {
  queries.tablet.removeEventListener('change', setBreakpoint)
  queries.mobile.removeEventListener('change', setBreakpoint)
  queries.xsMobile.removeEventListener('change', setBreakpoint)
}

export const useWindow = () => ({
  isXsMobile: inject('window/isXsMobile'),
  isMobile: inject('window/isMobile'),
  isTablet: inject('window/isTablet'),
})
