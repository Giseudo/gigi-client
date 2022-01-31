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

  <GTextDialog
    v-if="showTextDialog"
    @confirm="onTextDialogConfirmation"
  />
</template>

<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { GDialogue, GTextDialog } from '@/components'
import { initGame, initWindow, initNavigator, initInput, useInput, useSocket } from '@/store'
import { initDialogueService, useDialogueService } from '@/services/dialogue'

export default defineComponent({
  name: 'App',

  components: {
    GDialogue,
    GTextDialog
  },

  setup () {
    const { renderer } = initGame()
    const { message, showDialogue, continueDialogue } = useDialogueService()
    const { axis, buttonDown } = useInput()
    const { socket } = useSocket()
    const dialogue = ref(null)
    const showTextDialog = ref(false)

    initWindow()
    initNavigator()
    initInput()
    initDialogueService()

    const onOpenTextDialog = () => {
      showTextDialog.value = true
    }

    const onAuthenticated = (token) => console.log('logged in:', token)

    onMounted(() => {
      // Show camera's children on scene
      renderer.value.scene.add(renderer.value.camera)

      socket.value.on('dialog:text', onOpenTextDialog)
      socket.value.on('auth:token', onAuthenticated)
    })

    onBeforeUnmount(() => {
      socket.value.off('dialog:text', onOpenTextDialog)
      socket.value.off('auth:token', onAuthenticated)
    })

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

    const onTextDialogConfirmation = (value) => {
      showTextDialog.value = false

      socket.value.emit('auth:login', value)
    }

    return {
      dialogue,
      axis,
      renderer,
      message,
      showDialogue,
      showTextDialog,
      continueDialogue,
      onTextDialogConfirmation
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
