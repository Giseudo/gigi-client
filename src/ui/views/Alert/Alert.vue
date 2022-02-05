<template>
  <g-modal :opened="showAlert">
    <div class="alert" :class="classes">
      <g-text type="heading" class="alert__title">
        {{ title }}
      </g-text>

      <div class="alert__body">
        <g-text type="body">
          {{ message }}
        </g-text>
      </div>

      <g-button outlined
        theme="default"
        class="alert__confirm"
        @click="onConfirm"
      >
        {{ confirmText }}
      </g-button>
    </div>
  </g-modal>
</template>

<script>
import { defineComponent, provide, computed } from 'vue'
import { useAlert } from '@/store/alert'

export default defineComponent({
  name: 'Alert',

  setup () {
    const { title, message, showAlert, confirmAlert, confirmText } = useAlert()
    const theme = computed(() => 'light')
    const classes = computed(() => ({
      'alert--dark': theme.value === 'dark'
    }))

    const onConfirm = () => confirmAlert()

    provide('theme', theme)

    return {
      classes,
      title,
      message,
      title,
      showAlert,
      confirmText,
      onConfirm,
    }
  }
})
</script>

<style lang="scss">
.alert {
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
