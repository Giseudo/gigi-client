<template>
  <Renderer ref="renderer" resize="window">
    <Camera :position="{ z: 1 }" />
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
import { defineComponent } from 'vue'
import { initGame, initPointer } from './store'

export default defineComponent({
  setup () {
    initPointer()

    return initGame()
  }
})
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
}

#app {
  & > canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
