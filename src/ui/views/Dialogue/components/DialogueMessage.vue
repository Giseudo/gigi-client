<template>
  <div class="dialogue-message" :class="classes" @click="onMessageClick">
    <span class="dialogue-text dialogue-text--subhead">
      {{ message.speaker }}:
    </span>

    <span v-typewrite="{ text: message.text, skip, complete: onTypewriteEnd }"
      class="dialogue-text dialogue-text--body"
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

  setup (_, { emit }) {
    const { message } = useDialogue()
    const { buttonDown } = useInput()
    const showChoices = inject('dialogue/showChoices')
    const showPrompt = inject('dialogue/showPrompt')
    const isTyping = ref(true)
    const skip = ref(false)
    const classes = computed(() => ({
      'dialogue-message--underscore': showUnderscore.value,
    }))

    const showUnderscore = computed(() => 
      !showChoices.value && !showPrompt.value
    )

    const confirm = () => {
      if (showPrompt.value) return

      if (isTyping.value)
        return skip.value = true

      emit('confirm')
    }

    buttonDown(({ button }) => {
      if (button === 'confirm')
        return confirm()
    })

    watch(message, () => {
      skip.value = false
      isTyping.value = true
    })

    const onMessageClick = () => confirm()

    const onTypewriteEnd = () => {
      isTyping.value = false
      skip.value = false

      emit('typewrite')
    }

    return {
      skip,
      message,
      classes,
      onMessageClick,
      onTypewriteEnd
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
  background-color: rgba(black, .5);
  min-height: 100px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  @include responsive(desktop) {
    padding: 20px;
    padding-bottom: 40px;
  }

  &--underscore {
    cursor: pointer;
    &:after {
      content: "_";
      color: white;
      font-family: 'Source Code Variable';
      font-weight: 800;
      font-size: 14px;
      animation: underscore;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: steps(2, jump-none);
    }
  }
}
</style>
