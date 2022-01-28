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

  <GDialogue
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
import { initGame, initPointer, initWindow, initNavigator, initInput } from '@/store'
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

    initWindow()
    initNavigator()
    initPointer()
    initInput()
    initDialogueService()

    onBeforeUnmount(() => {
      destroyDialogueService()
    })

    return {
      renderer,
      login,
      message,
      showDialogue,
      continueDialogue
    }
  },

  data: () => ({
    isLoading: true,
    options: [
      'Dolor aliquam consectetur autem nesciunt amet',
      'Hello..?',
    ]
  }),

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      await this.login('7d762570-760d-11ec-a915-ef8a0b584cc1')

      this.isLoading = false

      // Otherwise camera children wont show on the scene
      this.renderer.scene.add(this.renderer.camera)
    },
  }
})
</script>

<style lang="scss">
@mixin responsive($breakpoint) {
  @if ($breakpoint == desktop) {
    @media (min-width: 901px) { @content }
  }
  @if ($breakpoint == tablet) {
    @media (max-width: 900px) { @content }
  }
  @if ($breakpoint == mobile) {
    @media (max-width: 600px) { @content }
  }
}

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
