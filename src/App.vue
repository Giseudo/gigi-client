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
    @continue="onDialogueContinue"
    @prompt="onDialogueReply"
  />
</template>

<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { GDialogue, GTextDialog } from '@/components'
import { useAuthService } from '@/services'
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
    const { login, token } = useAuthService()
    const dialogue = ref(null)
    const questionIdentifier = ref(null)
    const showTextDialog = ref(false) // deprecated, merge with GDialogue

    initWindow()
    initNavigator()
    initInput()
    initDialogueService()

    onMounted(() => {
      // Show camera's children on scene
      renderer.value.scene.add(renderer.value.camera)

      socket.value.on('dialogue:prompt', onDialoguePrompt)
    })

    onBeforeUnmount(() => {
      socket.value.off('dialogue:prompt', onDialoguePrompt)
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

    const onDialogueContinue = continueDialogue

    const onDialoguePrompt = (identifier, type) => {
      dialogue.value?.prompt(type)

      questionIdentifier.value = identifier
    }

    const onDialogueReply = async (value) => {
      if (questionIdentifier.value === 'request-access-code') {
        showTextDialog.value = false

        await login(value)

        socket.value.auth.token = token.value
        socket.value.disconnect().connect()

        dialogue.value?.confirm()
      }
    }

    socket.value.on('session', (value) => {
      socket.value.io.opts.query.sessionId = value
    })

    return {
      dialogue,
      axis,
      renderer,
      message,
      showDialogue,
      showTextDialog,
      onDialogueContinue,
      onDialogueReply
    }
  }
})
</script>

<style lang="scss">
body, html {
  margin: 0;
  height: 100%;
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
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
