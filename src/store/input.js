import { ref, computed } from 'vue'
import { Vector2 } from 'three'

const axis = ref(new Vector2())
const pressedKeys = ref([])

const setPrimaryAxis = (direction) => {
  axis.value.x = direction.x
  axis.value.y = direction.y
}

const UP_KEYS = [ 'w', 'ArrowUp' ]
const LEFT_KEYS = [ 'a', 'ArrowLeft' ]
const DOWN_KEYS = [ 's', 'ArrowDown' ]
const RIGHT_KEYS = [ 'd', 'ArrowRight' ]
const MOVEMENT_KEYS = [ ...UP_KEYS, ...LEFT_KEYS, ...RIGHT_KEYS, ...DOWN_KEYS ]

const onKeydown = event => {
  const { key } = event
  const isRepeating = pressedKeys.value.includes(key)

  if (isRepeating) return

  pressedKeys.value.push(key)

  if (MOVEMENT_KEYS.includes(key)) {
    const direction = { x: 0, y: 0 }

    if (LEFT_KEYS.includes(key)) direction.x = -1
    if (RIGHT_KEYS.includes(key)) direction.x = 1

    if (UP_KEYS.includes(key)) direction.y = 1
    if (DOWN_KEYS.includes(key)) direction.y = -1

    setPrimaryAxis(direction)
  }
}

const onKeyup = event => {
  const { key } = event

  const index = pressedKeys.value.indexOf(key)

  if (index < 0) return

  pressedKeys.value.splice(index, 1)

  if (pressedKeys.value.some(k => MOVEMENT_KEYS.includes(k))) return

  setPrimaryAxis({ x: 0, y: 0 })
}

export const initInput = () => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keyup', onKeyup)
}

export const destroyInput = () => {
  document.resetPrimaryAxisEventListener('keydown', onKeydown)
  document.resetPrimaryAxisEventListener('keyup', onKeyup)
}

export const useInput = () => ({
  axis: computed(() => axis.value),
  setPrimaryAxis
})
