<template>
  <g-modal v-if="true">
    <div class="alert-message" :class="classes">
      <g-text type="heading" class="alert-message__title">
        {{ title }}
      </g-text>

      <div class="alert-message__body">
        <g-text class="alert-message__text" type="body">
          <slot></slot>
        </g-text>
      </div>

      <g-button outlined
        theme="default"
        class="alert-message__confirm"
        @click="$emit('confirm')"
      >
        {{ confirmText }}
      </g-button>
    </div>
  </g-modal>
</template>

<script>
import { defineComponent, inject, computed } from 'vue'

export default defineComponent({
  name: 'AlertMessageModal',

  emits: [ 'confirm' ],

  setup () {
    const theme = inject('theme', 'light')
    const classes = computed(() => ({
      'alert-message--dark': theme.value === 'dark'
    }))

    return {
      classes
    }
  },

  props: {
    title: {
      type: String,
      default: 'Alert'
    },

    confirmText: {
      type: String,
      default: 'Confirm'
    }
  }
})
</script>

<style lang="scss">
.alert-message {
  width: 420px;
  padding: 40px;
  text-align: center;
  background: white;

  &__body {
    display: block;
    margin-top: 40px;
    margin-bottom: 40px;
  }
  
  &__confirm {
    width: 100%;
    text-align: center;
  }

  &--dark {
    background: rgba(black, .5);
  }
}
</style>
