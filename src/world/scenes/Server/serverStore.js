import { ref, computed } from 'vue'

const isInsideServer = ref(true)
const enterServer = () => isInsideServer.value = true
const exitServer = () => isInsideServer.value = false

export const useServerStore = () => ({
  isInsideServer: computed(() => isInsideServer.value),
  enterServer,
  exitServer,
})
