<template>
  <Renderer ref="renderer" resize="window">
    <Camera />
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
import { initGame, initPointer, initWindow, initNavigator, initInput } from './store'

export default defineComponent({
  setup () {
    const { renderer } = initGame()

    initWindow()
    initNavigator()
    initPointer()
    initInput()

    return {
      renderer
    }
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
    touch-action: none;
  }
}
</style>
