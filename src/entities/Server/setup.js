import { ref, computed, inject, provide } from 'vue'

const TRANSFORM = 'server/transform'
const ACTIVE_PORT = 'server/activePort'
const SET_ACTIVE_PORT = 'server/setActivePort'

export const initServer = () => {
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

export const useServer = () => {
  return {
    transform: inject(TRANSFORM),
    activePort: inject(ACTIVE_PORT),
    setActivePort: inject(SET_ACTIVE_PORT)
  }
}
