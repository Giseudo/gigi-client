<template>
  <div class="ui">
    <alert class="ui__alert" />
    <dialogue class="ui__dialogue" />
    <touch-stick v-if="gameplayInput" class="ui__touch-stick" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useInput } from '@/store'
import Alert from './views/Alert/Alert.vue'
import Dialogue from './views/Dialogue/Dialogue.vue'
import TouchStick from './views/TouchStick/TouchStick.vue'

export default defineComponent({
  name: 'UI',

  components: {
    Alert,
    Dialogue,
    TouchStick,
  },

  setup () {
    const { gameplayInput } = useInput()

    return { gameplayInput }
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
