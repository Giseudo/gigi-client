import { inject, provide, ref, onMounted, onBeforeUnmount } from 'vue'

const UPDATE = 'game/UPDATE'

export const initGame = () => {
  const time = ref(0)
  const deltaTime = ref(0)
  const renderer = ref(null)
  const camera = ref(null)

  const update = (callback) => {
    const { renderer, time, deltaTime } = useGame()
    const loopCallback = () => callback(time.value, deltaTime.value)

    onMounted(() => renderer.value.onBeforeRender(loopCallback))
    onBeforeUnmount(() => renderer.value.offBeforeRender(loopCallback))
  }

  const updateDeltaTime = ({ time: t }) => {
    time.value = t / 1000
    deltaTime.value = 0.01666 // time.value - previousTime.value
  }

  const mounted = () => {
    renderer.value.onBeforeRender(updateDeltaTime)
    camera.value = renderer.value.camera
  }

  provide('time', time)
  provide('deltaTime', deltaTime)
  provide('renderer', renderer)
  provide('camera', camera)
  provide(UPDATE, update)

  onMounted(mounted)

  return {
    renderer,
    time
  }
}

export const useGame = () => ({
  time: inject('time'),
  deltaTime: inject('deltaTime'),
  renderer: inject('renderer'),
  camera: inject('camera'),
  update: inject(UPDATE),
})
