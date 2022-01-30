<template>
  <Renderer ref="renderer" resize="window" >
    <Camera :fov="80" />
    <Scene>
      <RouterView />
    </Scene>
     <EffectComposer>
      <RenderPass />
      <FXAAPass />
    </EffectComposer>
  </Renderer>

  <GDialogue ref="dialogue"
    v-if="showDialogue"
    :text="message.text"
    :choices="message.choices"
    :speaker="message.speaker"
    @continue="continueDialogue"
  />
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { GDialogue } from '@/components'
import { initGame, initWindow, initNavigator, initInput, useInput } from '@/store'
import { initDialogueService, useDialogueService } from '@/services/dialogue'

export default defineComponent({
  name: 'App',

  components: {
    GDialogue
  },

  setup () {
    const { renderer } = initGame()
    const { message, showDialogue, continueDialogue } = useDialogueService()
    const { axis, buttonDown } = useInput()
    const dialogue = ref(null)

    initWindow()
    initNavigator()
    initInput()
    initDialogueService()

    // Show camera's children on scene
    onMounted(() => renderer.value.scene.add(renderer.value.camera))

    buttonDown(({ button }) => {
      if (button === 'confirm') {
        dialogue.value?.confirm()
      }
    })

    watch(axis.value, (value) => {
      const { y } = value

      if (y > 0) dialogue.value?.selectPrevious()
      if (y < 0) dialogue.value?.selectNext()
    })

    return {
      dialogue,
      axis,
      renderer,
      message,
      showDialogue,
      continueDialogue
    }
  }
})
</script>

<style lang="scss">
body {
  margin: 0;
}

#app {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  & > canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    touch-action: none;
  }

  & > .g-dialogue {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    z-index: 10;

    @include responsive(desktop) {
      bottom: 40px;
      left: 20px;
      right: 20px;
    }
  }
}
</style>
