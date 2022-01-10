import { inject, provide } from 'vue'
import { EventDispatcher } from 'three'

const SUBSCRIBE = 'pointer/subscribe'
const UNSUBSCRIBE = 'pointer/unsubscribe'
const dispatcher = new EventDispatcher()

const onPointerDown = event => dispatcher.dispatchEvent({ type: 'pointer-down', message: event })
const onPointerMove = event => dispatcher.dispatchEvent({ type: 'pointer-move', message: event })
const onPointerUp = event => dispatcher.dispatchEvent({ type: 'pointer-up', message: event })

const subscribe = (type, listener) => dispatcher.addEventListener(type, listener)
const unsubscribe = (type, listener) => dispatcher.removeEventListener(type, listener)

const setCursor = (value) => {
  const body = document.querySelector('body')

  body.style.cursor = value
}

const pointer = {
  subscribe,
  unsubscribe,
  setCursor
}

export const initPointer = () => {
  provide('setCursor', setCursor)
  provide('pointer', pointer)
  provide(SUBSCRIBE, subscribe)
  provide(UNSUBSCRIBE, unsubscribe)

  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

export const destroyPointer = () => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
}

export const usePointer = () => ({
  setCursor: inject('setCursor'),
  pointer: inject('pointer'),
  subscribe: inject(SUBSCRIBE),
  unsubscribe: inject(UNSUBSCRIBE),
})
