<template>
  <div class="g-modal">
    <div class="g-modal__overlay" />
    <div class="g-modal__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, provide } from 'vue'

export default defineComponent({
  name: 'GModal',

  setup () {
    return {}
  },

  props: {

  }
})
</script>

<style lang="scss">
.g-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;

  &__overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(black, .8);
  }

  &__body {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
