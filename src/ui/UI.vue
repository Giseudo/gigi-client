<template>
  <div class="ui">
    <alert class="ui__alert" />
    <dialogue class="ui__dialogue" />
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { initDialogue, useAlert } from '@/store'
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

    const { openAlert } = useAlert()

    onMounted(() => {
      setTimeout(() => openAlert({
        title: 'Alert',
        type: 'alert',
        message: 'oie',
        theme: 'warn',
        onConfirm: (done) => setTimeout(done, 1000)
      }), 1000)
    })
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
