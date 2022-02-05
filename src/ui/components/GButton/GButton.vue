<template>
  <button class="g-button" :class="classes" :disabled="disabled">
    <g-text type="button">
      <slot></slot>
    </g-text>
  </button>
</template>

<script>
import { defineComponent, inject, computed } from 'vue'

export const BUTTON_THEMES = [
  'default', 'success', 'warn', 'error'
]

export default defineComponent({
  name: 'GButton',

  setup (props) {
    const theme = inject('theme', 'light')

    const classes = computed(() => ([
      `g-button--${props.theme}`,
      {
        'g-button--disabled': props.disabled,
        'g-button--dark': theme.value === 'dark',
        'g-button--outlined': props.outlined,
      }
    ]))

    return {
      classes
    }
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
    },

    outlined: {
      type: Boolean,
      default: false
    }
  },
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

  &:focus {
    outline: 4px solid orange;
  }

  @include responsive(desktop) {
    padding: 10px 20px;
  }

  &--outlined {
    border: 2px solid transparent;
  }

  &--default {
    background: white;
    border-color: black;

    &.g-button--dark {
      background: rgba(black, .5);
      border-color: white;
    }
  }

  &--success {
    &.g-button--dark {
      color: green;
      background: rgba(green, .2);
    }
  }

  &--warn {
    background: orange;

    &.g-button--dark { color: orange; }
  }

  &--error {
    background: red;

    &.g-button--dark { color: orange; }
  }
}
</style>
