import { inject, provide, ref, onMounted } from 'vue'

export const time = ref(0)
const deltaTime = ref(0)
const previousTime = ref(0)
const renderer = ref(null)
const camera = ref(null)

const updateDeltaTime = ({ time: t }) => {
  time.value = t / 1000
  deltaTime.value = time.value - previousTime.value
  previousTime.value = time.value
}

const mounted = () => {
  renderer.value.onBeforeRender(updateDeltaTime)
  camera.value = renderer.value.camera
}

export const initGame = () => {
  provide('time', time)
  provide('deltaTime', deltaTime)
  provide('renderer', renderer)
  provide('camera', camera)

  onMounted(mounted)

  return {
    time,
    deltaTime,
    renderer,
    camera
  }
}

export const useGame = () => ({
  time: inject('time'),
  deltaTime: inject('deltaTime'),
  renderer: inject('renderer'),
  camera: inject('camera')
})
