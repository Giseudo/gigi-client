<template>
  <div class="dialogue-message" :class="classes" @click="onMessageClick">
    <div class="dialogue-message__speaker" v-if="message.speaker">
      <g-text type="subheading">
        {{ message.speaker }}:
      </g-text>
    </div>

    <g-text v-typewrite="typewrite"
      class="dialogue-message__body"
      type="dialogue"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, inject } from 'vue'
import { useDialogue, useInput } from '@/store'
import { typewrite } from '@/directives/typewrite'

export default defineComponent({
  name: 'DialogueMessage',

  directives: { typewrite },

  emits: [ 'confirm', 'typewrite' ],

  setup (_, { emit }) {
    const { message } = useDialogue()
    const { buttonDown } = useInput()
    const showChoices = inject('dialogue/showChoices')
    const showPrompt = inject('dialogue/showPrompt')
    const theme = inject('theme', 'light')
    const isTyping = ref(true)
    const skip = ref(false)

    const classes = computed(() => ({
      'dialogue-message--underscore': showUnderscore.value,
      'dialogue-message--dark': theme.value === 'dark'
    }))

    const typewrite = computed(() => ({
      text: message.value.text,
      skip: skip.value,
      complete: onTypewriteEnd
    }))

    const showUnderscore = computed(() => 
      !showChoices.value && !showPrompt.value
    )

    buttonDown(({ button }) => {
      if (button === 'confirm')
        return confirm()
    })

    watch(message, () => {
      skip.value = false
      isTyping.value = true
    })

    const confirm = () => {
      if (showPrompt.value) return

      if (isTyping.value)
        return skip.value = true

      emit('confirm')
    }

    const onMessageClick = () => confirm()

    const onTypewriteEnd = () => {
      isTyping.value = false
      skip.value = false

      emit('typewrite')
    }

    return {
      skip,
      message,
      typewrite,
      classes,
      onMessageClick,
    }
  }
})
</script>

<style lang="scss">
.dialogue-message {
  flex: 1 100%;
  padding: 15px;
  padding-bottom: 20px;
  position: relative;
  background-color: white;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &__speaker {
    margin-bottom: 10px;
    .g-text {
      background: black;
      color: white;
      display: inline-block;
      padding: 0 10px;
    }

    @include responsive(desktop) {
      .g-text {
        padding: 5px 15px;
      }
    }
  }

  @include responsive(desktop) {
    padding: 30px;
    padding-bottom: 50px;
  }

  &--underscore {
    cursor: pointer;
    &:after {
      content: "_";
      color: black;
      font-family: 'Source Code Variable';
      font-weight: 800;
      font-size: 18px;
      animation: underscore;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: steps(2, jump-none);
    }

    @include responsive(desktop) {
      &:after {
        font-size: 24px;
      }
    }
  }

  &--dark {
    background-color: rgba(black, .5);

    &:after {
      color: white;
    }

    .dialogue-message {
      &__speaker {
        .g-text {
          background: white;
          color: black;
        }
      }
    }
  }
}
</style>
