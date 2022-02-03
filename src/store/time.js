import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const time = ref(0)
const deltaTime = ref(0)

const update = (callback) => {
  const loopCallback = () => callback(time.value, deltaTime.value)

  onMounted(() => renderer.value.onBeforeRender(loopCallback))
  onBeforeUnmount(() => renderer.value?.offBeforeRender(loopCallback))
}

const updateTime = ({ time: t }) => {
  time.value = t / 1000
  deltaTime.value = 0.01666
}

export const initTime = () => {
  const { renderer } = useGame()

  onMounted(() => {
    renderer.value.onBeforeRender(updateTime)
  })

  onBeforeUnmount(() => {
    renderer.value.offBeforeRender(updateTime)
  })
}

export const useTime = () => ({
  time: computed(() => time.value),
  deltaTime: computed(() => deltaTime.value),
  update
})
