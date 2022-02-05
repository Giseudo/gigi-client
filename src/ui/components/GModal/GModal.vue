<template>
  <transition name="modal">
    <div v-if="opened" class="g-modal">
      <div class="g-modal__overlay" />
      <div class="g-modal__body">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GModal',

  setup () {
    return {}
  },

  props: {
    opened: {
      type: Boolean,
      default: true
    }
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.5);
}
</style>
