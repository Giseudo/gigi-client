<template>
  <transition name="modal" :class="classes">
    <div v-if="opened" class="g-modal">
      <div class="g-modal__overlay" />
      <div class="g-modal__body">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent, computed, inject } from 'vue'

export default defineComponent({
  name: 'GModal',

  setup () {
    const theme = inject('theme', 'light')
    const classes = computed(() => ({
      'g-modal--dark': theme.value === 'dark'
    }))

    return {
      classes
    }
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
    background: rgba(black, .5);
  }

  &__body {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &--dark {
    .g-modal {
      &__overlay {
        background: rgba(white, .1);
      }
    }
  }
}

.modal-enter-active {
  transition: opacity .2s ease, transform .5s;
}

.modal-leave-active {
  transition: opacity .2s ease .3s;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-to {
  .g-modal {
    &__body {
      animation-name: modal;
      animation-iteration-count: 1;
      animation-play-state: running;
      animation-duration: .3s;
    }
  }
}

.modal-leave-to {
  opacity: 0;
  .g-modal {
    &__body {
      animation-name: modal;
      animation-iteration-count: 1;
      animation-play-state: running;
      animation-duration: .3s;
      animation-direction: reverse;
      animation-fill-mode: forwards;
    }
  }
}

@keyframes modal {
  0% { transform: scale(1, 0); }
  100% { transform: scale(1, 1); }
}
</style>
