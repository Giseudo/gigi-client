<template>
  <Renderer ref="renderer" resize="window" >
    <Camera ref="camera" :fov="80" />
    <Scene>
      <RouterView />
    </Scene>
     <EffectComposer>
      <RenderPass />
      <FXAAPass />
    </EffectComposer>
  </Renderer>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { initGame, initCamera, initTime } from '@/store'

export default defineComponent({
  setup () {
    const { renderer } = initGame()
    const { camera } = initCamera()

    initTime(renderer)

    onMounted(() => {
      // add camera to scene, so its children become visible
      renderer.value.scene.add(renderer.value.camera)
    })
  
    return {
      renderer,
      camera
    }
  }
})
</script>
