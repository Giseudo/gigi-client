<template>
  <div class="g-input" :class="classes">
    <input ref="field"
      type="text"
      class="g-input__field"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import { defineComponent, inject, ref, computed } from 'vue'

export default defineComponent({
  name: 'GInput',

  setup () {
    const field = ref(null)
    const theme = inject('theme', 'light')
    const classes = computed(() => ({
      'g-input--dark': theme.value === 'dark'
    }))

    const focus = () => {
      field.value?.focus()
    }

    return {
      classes,
      field,
      focus
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
    font-weight: 600;
    font-size: 13px;
    background: transparent;

    &:focus {
      outline: 4px solid orange;
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
