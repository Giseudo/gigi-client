<template>
  <div class="ui">
    <alert class="ui__alert" />
    <dialogue class="ui__dialogue" />
  </div>
</template>

<script>
import { defineComponent, provide } from 'vue'
import { initDialogue } from '@/store'
import Alert from './views/Alert/Alert.vue'
import Dialogue from './views/Dialogue/Dialogue.vue'

export default defineComponent({
  name: 'UI',

  components: {
    Alert,
    Dialogue,
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

.alert {
  width: 300px;
  padding: 20px;
  background: rgba(black, .5);

  &__title {
    text-align: center;
  }
  &__button {
    width: 100%;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 0;
  }
}
</style>
