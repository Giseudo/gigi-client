import { onMounted, onBeforeUnmount } from 'vue'

const setCursor = (value) => {
  const body = document.querySelector('body')

  body.style.cursor = value
}

const pointerDown = (callback) => {
  onMounted(() => document.addEventListener('pointerdown', callback))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', callback))
}

const pointerMove = (callback) => {
  onMounted(() => document.addEventListener('pointermove', callback))
  onBeforeUnmount(() => document.removeEventListener('pointermove', callback))
}

const pointerUp = (callback) => {
  onMounted(() => document.addEventListener('pointerup', callback))
  onBeforeUnmount(() => document.removeEventListener('pointerup', callback))
}

export const usePointer = () => ({
  setCursor,
  pointerDown,
  pointerMove,
  pointerUp,
})
