<template>
  <div class="ui">
    <dialogue class="ui__dialogue" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { initDialogue } from '@/store'
import Dialogue from './views/Dialogue/Dialogue.vue'

export default defineComponent({
  name: 'UI',

  components: {
    Dialogue
  },

  setup () {
    initDialogue()
  }
})
</script>

<style lang="scss">
.ui {
  &__dialogue {
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
