import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Box3, Vector3 } from 'three'
import { useInput } from '@/store'
import socket from '@/socket'

const BOUNDARIES_MIN = new Vector3(-999, -999, -999)
const BOUNDARIES_MAX = new Vector3( 999,  999,  999)

const player = ref(null)
const isPaused = ref(true)
const boundaries = new Box3(BOUNDARIES_MIN, BOUNDARIES_MAX)

const pause = () => isPaused.value = true
const resume = () => isPaused.value = false
const setPlayer = (value) => player.value = value
const resetBoundaries = () => boundaries.set(BOUNDARIES_MIN, BOUNDARIES_MAX)

const inputAxis = ref(null)
const axis = computed(() => {
  if (isPaused.value) return { x: 0, y: 0 }

  return inputAxis.value
})

export const initGameplay = () => {
  const { axis } = useInput()
  inputAxis.value = axis.value

  onMounted(() => {
    socket.on('gameplay:pause', pause)
    socket.on('gameplay:resume', resume)

    socket.on('interaction:start', pause)
    socket.on('interaction:end', resume)
  })

  onBeforeUnmount(() => {
    socket.off('gameplay:pause', pause)
    socket.off('gameplay:resume', resume)

    socket.off('interaction:start', pause)
    socket.off('interaction:end', resume)
  })
}

export const useGameplay = () => ({
  player: computed(() => player.value),
  isPaused: computed(() => isPaused.value),
  boundaries: computed(() => boundaries),
  resetBoundaries,
  pause,
  resume,
  axis,
  setPlayer,
})
