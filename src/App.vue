<template>
  <Renderer ref="renderer" resize="window">
    <Camera :fov="60" />
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
import { useAuthService } from './services/auth'

export default defineComponent({
  setup () {
    const { renderer } = initGame()
    const { login } = useAuthService()

    initWindow()
    initNavigator()
    initPointer()
    initInput()

    return {
      renderer,
      login,
    }
  },

  mounted () {
    this.login('7d762570-760d-11ec-a915-ef8a0b584cc1')
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
