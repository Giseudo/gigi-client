import { inject, provide } from 'vue'

const setCursor = (value) => {
  const body = document.querySelector('body')

  body.style.cursor = value
}

export const initPointer = () => {
  provide('setCursor', setCursor)
}

export const usePointer = () => ({
  setCursor: inject('setCursor')
})
