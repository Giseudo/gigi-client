<template>
  <button class="g-button" :class="classes" :disabled="disabled">
    <g-text type="button">
      <slot></slot>
    </g-text>
  </button>
</template>

<script>
import { defineComponent, provide } from 'vue'

export const BUTTON_THEMES = [
  'default', 'success', 'warn', 'error'
]

export default defineComponent({
  name: 'GButton',

  setup () {
    provide('theme', 'dark')
  },

  props: {
    theme: {
      type: String,
      default: 'default',
      validation: (value) => BUTTON_THEMES.includes(value)
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    classes () {
      return [
        `g-button--${this.theme}`,
        { 'g-button--disabled': this.disabled }
      ]
    }
  }
})
</script>

<style lang="scss">
.g-button {
  position: relative;
  padding: 10px 15px;
  border: 0;
  text-align: left;
  cursor: pointer;
  transition: opacity .2s ease, transform .2s ease;
  -webkit-tap-highlight-color: rgba(white, .0);

  @include responsive(desktop) {
    margin-bottom: 20px;
    padding: 10px 20px;
  }

  &--default {
    background-color: rgba(black, .5);
  }

  &--success {

  }

  &--warn {

  }

  &--error {

  }
}
</style>
