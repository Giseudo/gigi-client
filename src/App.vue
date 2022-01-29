<template>
  <Renderer ref="renderer" resize="window" >
    <Camera :fov="80" />
    <Scene>
      <RouterView v-if="!isLoading" />
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
import { defineComponent, onBeforeUnmount } from 'vue'
import { GDialogue } from '@/components'
import { initGame, initPointer, initWindow, initNavigator, initInput, useInput } from '@/store'
import { useAuthService } from '@/services/auth'
import { initDialogueService, useDialogueService, destroyDialogueService } from '@/services/dialogue'

export default defineComponent({
  name: 'App',

  components: {
    GDialogue
  },

  setup () {
    const { renderer } = initGame()
    const { login } = useAuthService()
    const { message, showDialogue, continueDialogue } = useDialogueService()
    const { axis, subscribe } = useInput()

    initWindow()
    initNavigator()
    initPointer()
    initInput()
    initDialogueService()

    onBeforeUnmount(() => {
      destroyDialogueService()
    })

    return {
      axis,
      renderer,
      login,
      subscribe,
      message,
      showDialogue,
      continueDialogue
    }
  },

  watch: {
    'axis.y' (value) {
      const { dialogue } = this.$refs

      if (!dialogue) return

      if (value > 0) dialogue.selectPrevious()
      if (value < 0) dialogue.selectNext()
    }
  },

  data: () => ({
    isLoading: true
  }),

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      await this.login('7d762570-760d-11ec-a915-ef8a0b584cc1')

      this.isLoading = false

      // Show camera's children on scene
      this.renderer.scene.add(this.renderer.camera)

      this.subscribe('button:down', ({ button }) => {
        const { dialogue } = this.$refs

        if (button === 'confirm')
          dialogue?.confirm()
      })
    },
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
