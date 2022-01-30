import { computed } from 'vue'
import { socket } from '@/socket'

export const useSocket = () => ({
  socket: computed(() => socket)
})
