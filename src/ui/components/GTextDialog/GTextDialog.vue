<template>
  <div class="g-text-dialog">
    <input
      type="text"
      v-model="text"
    />

    <button @click="$emit('confirm', text)">
      Confirm
    </button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const text = ref('')

    return {
      text
    }
  }
})
</script>

<style lang="scss">
.g-text-dialog {
  background: red;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
