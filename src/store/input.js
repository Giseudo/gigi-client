import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Vector2, EventDispatcher } from 'three'

const UP_KEYS = [ 'w', 'ArrowUp' ]
const LEFT_KEYS = [ 'a', 'ArrowLeft' ]
const DOWN_KEYS = [ 's', 'ArrowDown' ]
const RIGHT_KEYS = [ 'd', 'ArrowRight' ]
const MOVEMENT_KEYS = [ ...UP_KEYS, ...LEFT_KEYS, ...RIGHT_KEYS, ...DOWN_KEYS ]
const CONFIRM_KEYS = [ ' ', 'Enter' ]

const axis = ref(new Vector2())
const pressedKeys = ref([])
const dispatcher = new EventDispatcher()

const setPrimaryAxis = (direction) => {
  axis.value.x = direction.x
  axis.value.y = direction.y
}

const onKeydown = event => {
  const { key } = event
  const isRepeating = pressedKeys.value.includes(key)

  if (isRepeating) return

  pressedKeys.value.push(key)

  if (MOVEMENT_KEYS.includes(key)) {
    const direction = { x: axis.value.x, y: axis.value.y }

    if (LEFT_KEYS.includes(key)) direction.x = -1
    if (RIGHT_KEYS.includes(key)) direction.x = 1

    if (UP_KEYS.includes(key)) direction.y = 1
    if (DOWN_KEYS.includes(key)) direction.y = -1

    setPrimaryAxis(direction)
  }

  if (CONFIRM_KEYS.includes(key)) {
    dispatcher.dispatchEvent({ type: 'button:down', button: 'confirm' })
  }
}

const onKeyup = event => {
  const { key } = event

  const index = pressedKeys.value.indexOf(key)

  if (index < 0) return

  pressedKeys.value.splice(index, 1)

  const x = pressedKeys.value.some(k =>
    [ ...LEFT_KEYS, ...RIGHT_KEYS ].includes(k)
  ) ? axis.value.x : 0

  const y = pressedKeys.value.some(k =>
    [ ...UP_KEYS, ...DOWN_KEYS ].includes(k)
  ) ? axis.value.y : 0

  setPrimaryAxis({ x, y })
}

export const initInput = () => {
  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('keyup', onKeyup)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('keyup', onKeyup)
  })
}

const buttonDown = (callback) => {
  onMounted(() => dispatcher.addEventListener('button:down', callback))
  onBeforeUnmount(() => dispatcher.removeEventListener('button:down', callback))
}

export const useInput = () => ({
  axis: computed(() => axis.value),
  setPrimaryAxis,
  buttonDown,
})
