import { ref, computed, inject, provide } from 'vue'

const TRANSFORM = 'gateway/transform'
const ACTIVE_PORT = 'gateway/activePort'
const SET_ACTIVE_PORT = 'gateway/setActivePort'

export const initGateway = () => {
  const transform = ref(null)
  const activePort = ref(null)
  const setActivePort = (value) => activePort.value = value

  provide(TRANSFORM, computed(() => transform.value))
  provide(ACTIVE_PORT, computed(() => activePort.value))
  provide(SET_ACTIVE_PORT, setActivePort)

  return {
    transform,
    activePort,
    setActivePort,
  }
}

export const useGateway = () => {
  return {
    transform: inject(TRANSFORM),
    activePort: inject(ACTIVE_PORT),
    setActivePort: inject(SET_ACTIVE_PORT)
  }
}

export { default as Gateway } from './Gateway'
export { default as Port } from './Port'
