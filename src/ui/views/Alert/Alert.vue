<template>
  <g-modal :opened="showAlert">
    <div class="alert" :class="classes">
      <div class="alert__body">
        <g-text type="heading" class="alert__title">
          {{ title }}
        </g-text>

        <g-text type="body">
          {{ message }}
        </g-text>
      </div>

      <div class="alert__footer">
        <g-button outlined
          theme="default"
          class="alert__cancel"
          @click="onCancel"
        >
          {{ cancelText }}
        </g-button>

        <g-button filled
          theme="default"
          class="alert__confirm"
          @click="onConfirm"
        >
          {{ confirmText }}
        </g-button>
      </div>
    </div>
  </g-modal>
</template>

<script>
import { defineComponent, provide, computed } from 'vue'
import { useAlert } from '@/store/alert'

export default defineComponent({
  name: 'Alert',

  setup () {
    const {
      title, message, theme, showAlert,
      confirmAlert, confirmText, cancelText,
      cancelAlert
    } = useAlert()

    const classes = computed(() => ({
      'alert--dark': theme.value === 'dark'
    }))

    const onConfirm = () => confirmAlert()
    const onCancel = () => cancelAlert()

    provide('theme', theme)

    return {
      theme,
      classes,
      title,
      message,
      title,
      showAlert,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    }
  }
})
</script>

<style lang="scss">
.alert {
  width: 90%;
  padding: 20px;
  background: rgba(white, 1);
  text-align: center;

  &__body {
    display: block;
    margin-top: 30px;
    margin-bottom: 50px;
  }
  
  &__cancel {
    flex: 1;
    margin-right: 10px;
  }

  &__confirm {
    flex: 1;
    margin-left: 10px;
  }

  &__footer { display: flex; }

  @include responsive(tablet) {
    width: 460px;
    padding: 40px;
  }

  &--dark {
    background: rgba(black, 1);
  }
}
</style>
