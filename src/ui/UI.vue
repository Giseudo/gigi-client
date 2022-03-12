<template>
  <div class="ui">
    <alert class="ui__alert" />
    <dialogue class="ui__dialogue" />
    <!--touch-stick class="ui__touch-stick" /-->
    <interaction class="ui__interaction" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Alert from './views/Alert/Alert.vue'
import Dialogue from './views/Dialogue/Dialogue.vue'
import TouchStick from './views/TouchStick/TouchStick.vue'
import Interaction from './views/Interaction/Interaction.vue'

export default defineComponent({
  name: 'UI',

  components: {
    Alert,
    Dialogue,
    TouchStick,
    Interaction,
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

  &__interaction {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 5;
  }
}
</style>
