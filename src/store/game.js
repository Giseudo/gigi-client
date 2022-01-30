import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const time = ref(0)
const deltaTime = ref(0)
const renderer = ref(null)
const camera = ref(null)

const update = (callback) => {
  const loopCallback = () => callback(time.value, deltaTime.value)

  onMounted(() => renderer.value.onBeforeRender(loopCallback))
  onBeforeUnmount(() => renderer.value?.offBeforeRender(loopCallback))
}

const updateTime = ({ time: t }) => {
  time.value = t / 1000
  deltaTime.value = 0.01666
}

export const initGame = () => {
  onMounted(() => {
    renderer.value.onBeforeRender(updateTime)
    camera.value = renderer.value.camera
  })

  onBeforeUnmount(() => {
    renderer.value.offBeforeRender(updateTime)
  })

  return {
    renderer,
    time
  }
}

export const useGame = () => ({
  time: computed(() => time.value),
  deltaTime: computed(() => deltaTime.value),
  renderer: computed(() => renderer.value),
  camera: computed(() => camera.value),
  update,
})
