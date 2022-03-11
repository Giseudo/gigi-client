<template>
  <button class="g-button" :class="classes" :disabled="disabled">
    <g-text class="g-button__text" :type="jumbo ? 'button-jumbo' : 'button'">
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
        'g-button--filled': props.filled,
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
    },

    filled: {
      type: Boolean,
      default: false
    },

    jumbo: {
      type: Boolean,
      default: false
    }
  },
})
</script>

<style lang="scss">
.g-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  border: 0;
  text-align: left;
  cursor: pointer;
  transition: opacity .2s ease, transform .2s ease;
  -webkit-tap-highlight-color: rgba(white, .0);

  &__text {
    position: relative;
    z-index: 5;
  }

  &:focus {
    outline-width: 4px;
    outline-style: solid;
    outline-offset: 2px;
    animation-name: selected-outline;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  @include responsive(desktop) {
    padding: 10px 20px;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border: 2px solid transparent;
  }

  &--default {
    &.g-button {
      background: rgba(white, 1);

      &--outlined:after {
        border-color: black;
      }

      &--filled {
        .g-button__text { color: white; }
        &:after { background: black; }
      }
    }

    &.g-button--dark {
      &.g-button {
        background: rgba(black, .5);

        &--outlined:after {
          border-color: white;
        }

        &--filled {
          .g-button__text { color: black; }
          &:after { background: white; }
        }
      }
    }
  }

  &--success { }
  &--warn { }
  &--error { }
}
</style>
