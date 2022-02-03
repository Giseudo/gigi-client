<template>
  <World />
  <UI />
</template>

<script>
import { defineComponent } from 'vue'
import { initWindow, initInput } from '@/store'
import { World } from './world'
import { UI } from './ui'

export default defineComponent({
  name: 'App',

  components: {
    World,
    UI
  },

  setup () {
    initWindow()
    initInput()
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
}
</style>
