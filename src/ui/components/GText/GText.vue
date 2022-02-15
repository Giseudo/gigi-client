<template>
  <span class="g-text" :class="classes">
    <slot></slot>
  </span>
</template>

<script>
import { defineComponent, inject } from 'vue'

export const TEXT_THEMES = [
  'heading', 'subheading', 'body', 'button', 'button-jumbo'
]

export default defineComponent({
  name: 'GText',

  setup () {
    const theme = inject('theme', 'light')

    return { theme }
  },

  props: {
    type: {
      type: String,
      default: 'body',
      validation: (value) => TEXT_THEMES.includes(value)
    },
  },

  computed: {
    classes () {
      return [
        `g-text--${this.type}`,
        `g-text--${this.theme}`
      ]
    }
  }
})
</script>

<style lang="scss">
.g-text {
  font-family: 'Source Code Variable';

  &--heading {
    display: block;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 30px;

    @include responsive(desktop) { }
  }

  &--subheading {
    display: block;
    font-size: 14px;
    font-weight: 800;
    line-height: 24px;
    letter-spacing: 1px;
    margin-bottom: 10px;

    @include responsive(desktop) {
      font-size: 16px;
    }
  }

  &--body {
    font-size: 12px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 1px;

    @include responsive(desktop) {
      font-size: 14px;
    }
  }

  &--button {
    font-size: 12px;
    font-weight: 800;
    line-height: 18px;
    letter-spacing: 3px;
    text-transform: uppercase;

    @include responsive(desktop) {
      font-size: 14px;
      line-height: 24px;
    }
  }

  &--button-jumbo {
    font-size: 20px;
    font-weight: 800;
    line-height: 18px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  &--light {
    color: black;
  }

  &--dark {
    color: white;
  }
}
</style>
