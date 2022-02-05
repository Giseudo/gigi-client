<template>
  <alert-message :title="title">
    {{ message }}
  </alert-message>
</template>

<script>
import { defineComponent, ref, provide, computed } from 'vue'
import AlertMessage from './components/AlertMessage.vue'

export default defineComponent({
  name: 'Alert',

  components: {
    AlertMessage
  },

  setup () {
    const message = ref('Ipsum facilis illum harum distinctio nostrum Nobis itaque ducimus sit iste esse Accusantium voluptatem cumque sunt officiis sapiente, nisi. Cupiditate')
    const title = ref('Alert')

    provide('theme', computed(() => 'dark'))

    return {
      message,
      title
    }
  }
})
</script>
