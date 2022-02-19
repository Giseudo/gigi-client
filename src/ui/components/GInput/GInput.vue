<template>
  <div class="g-input" :class="classes">
    <input ref="field"
      type="text"
      class="g-input__field"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onChange"
    />
  </div>
</template>

<script>
import { defineComponent, inject, ref, computed } from 'vue'

export default defineComponent({
  name: 'GInput',

  setup (_, { emit }) {
    const field = ref(null)
    const theme = inject('theme', 'light')
    const classes = computed(() => ({
      'g-input--dark': theme.value === 'dark'
    }))

    const focus = () => {
      field.value?.focus()
    }

    const onChange = (event) => {
      emit('update:modelValue', event.target.value)
    }

    return {
      classes,
      field,
      focus,
      onChange
    }
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    },

    placeholder: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss">
.g-input {
  background: rgba(black, .5);
  padding: 0;

  &__field {
    width: 100%;
    color: white;
    height: 38px;
    padding: 0 15px;
    border: 0;
    font-family: 'Source Code Variable';
    font-size: 16px;
    font-weight: 800;
    line-height: 18px;
    letter-spacing: 1px;
    background: transparent;

    @include responsive(desktop) {
      font-size: 18px;
      font-weight: 700;
      line-height: 24px;
    }

    &:focus {
      outline-width: 4px;
      outline-style: solid;
      outline-offset: 2px;
      animation-name: selected-outline;
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }

    &::placeholder {
    }
  }

  &--dark {
    background: white;
    .g-input {
      &__field {
        color: black;
      }
    }
  }

  @include responsive(desktop) {
    &__field {
      font-size: 16px;
      padding: 0 20px;
      height: 44px;
    }
  }
}
</style>
