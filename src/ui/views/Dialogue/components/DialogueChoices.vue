<template>
  <transition name="choices" mode="out-in">
    <div v-if="showChoices" class="dialogue-choices" :class="classes">
      <g-button v-for="(choice, index) in choices"
        ref="buttons"
        class="dialogue-choices__choice"
        :key="index"
        :class="{ 'dialogue-choices__choice--selected': index === activeChoice }"
        @click="onClick(index)"
        @mouseenter="onSelect(index)"
        @focus="onSelect(index)"
      >
        {{ choice }}
      </g-button>
    </div>
  </transition>
</template>

<script>
import { defineComponent, ref, inject, watch, computed } from 'vue'
import { useWindow, useInput, useDialogue } from '@/store'
import anime from 'animejs'

export default defineComponent({
  name: 'DialogueChoices',

  emits: [ 'choose' ],

  setup (_, { emit }) {
    const { isMobile } = useWindow()
    const { axis } = useInput()
    const { choices } = useDialogue()
    const activeChoice = inject('dialogue/activeChoice')
    const showChoices = inject('dialogue/showChoices')
    const hasChosen = ref(false)
    const theme = inject('theme', 'light')
    const classes = computed(() => ({
      'dialogue-choices--has-chosen': hasChosen.value,
      'dialogue-choices--dark': theme.value === 'dark'
    }))

    watch(axis.value, (value) => {
      if (!showChoices.value) return

      const { y } = value

      if (y > 0) selectPrevious()
      if (y < 0) selectNext()
    })

    const select = (index) => {
      if (index < 0) return
      if (index > choices.value.length - 1) return

      activeChoice.value = index
    }

    const selectPrevious = () => {
      select(activeChoice.value - 1)
    }

    const selectNext = () => {
      select(activeChoice.value + 1)
    }

    const choose = () => {
      hasChosen.value = true

      setTimeout(() => emit('choose'), 200)
    }

    const onClick = (index) => {
      select(index)

      choose()
    }
    
    const onSelect = (index) => {
      select(index)
    }

    return {
      isMobile,
      choices,
      classes,
      showChoices,
      activeChoice,
      hasChosen,
      onClick,
      onSelect,
    }
  },

  /* watch: {
    activeChoice (index) {
      if (this.hasChosen) return

      const { buttons, cursor } = this.$refs
      const button = buttons[index]

      if (!button) return

      const el = button.$el
      const height = this.isMobile ? 38 : 44
      const rectA = el.getBoundingClientRect()
      const rectB = el.parentNode.getBoundingClientRect()
      const offset = (rectA.top - rectB.top) + (height / 2)

      anime({
        targets: cursor,
        top: `${offset}px`,
        duration: 150,
        easing: 'easeOutQuad'
      })
    }
  }, */
})
</script>

<style lang="scss">
.dialogue-choices {
  display: flex;
  flex-flow: column;
  position: relative;

  &__choice {
    margin-bottom: 10px;

    @include responsive(desktop) { margin-bottom: 20px; }

    &--selected {
      outline: 4px solid orange;
      &:before {
        content: "";
        position: absolute;
        top: 22px;
        left: -40px;
        transition: left .2s ease;
        animation-name: cursor;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        width: 12px;
        height: 12px;
        border-right: 4px solid orange;
        border-bottom: 4px solid orange;
        transform: rotateZ(-45deg);
        transform-origin: 0% 0%;
      }
    }
  }

  &--has-chosen {
    .dialogue-choices {
      &__choice {
        &:not(&--selected) { opacity: 0; }
        &--selected { opacity: 1; transform: scale(1.1) }
      }

      &__cursor { left: -50px; }
    }
  }

  @keyframes cursor {
    0% { transform: translateX(0px) rotateZ(-45deg); }
    50% { transform: translateX(-5px) rotateZ(-45deg); }
    100% { transform: translateX(0px) rotateZ(-45deg); }
  }
}
</style>
