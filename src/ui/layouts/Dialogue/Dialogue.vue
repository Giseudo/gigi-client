<template>
  <div class="dialogue" v-if="showDialogue">
    <div class="dialogue__container">
      <transition name="choices" mode="out-in">
        <dialogue-choices v-if="showChoices"
          class="dialogue__choices"
          @choose="onChoiceChosen"
        />
      </transition>

      <dialogue-prompt
        class="dialogue__prompt"
        @confirm="onPromptSubmit"
      />

      <dialogue-message
        class="dialogue__message"
        @confirm="onMessageConfirm"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, provide } from 'vue'
import { useWindow, useDialogue, useAuth } from '@/store'
import DialogueChoices from './components/DialogueChoices.vue'
import DialogueMessage from './components/DialogueMessage.vue'
import DialoguePrompt from './components/DialoguePrompt.vue'

export default defineComponent({
  components: {
    DialogueChoices,
    DialogueMessage,
    DialoguePrompt
  },

  setup () {
    const { isMobile } = useWindow()
    const { message, choices, showDialogue, continueDialogue } = useDialogue()
    const { login } = useAuth()

    const activeChoice = ref(0)
    const showChoices = ref(false)
    const showPrompt = ref(false)

    provide('dialogue/activeChoice', activeChoice)
    provide('dialogue/showChoices', showChoices)
    provide('dialogue/showPrompt', showPrompt)

    const onMessageConfirm = () => confirm()

    const onChoiceChosen = () => choose()

    const onPromptSubmit = async ({ identifier, value }) => {
      if (identifier === 'request-access-code')
        await login(value)

      showPrompt.value = false

      choose()
    }

    const confirm = () => {
      if (!showChoices.value && choices.value.length > 1)
        return showChoices.value = true
      
      // FIXME we need to show prompt only when the message is not typing anymore
      // if (!showPrompt.value && promptType.value)
      // return showPrompt.value = true

      choose()
    }

    const choose = (index) => {
      if (showPrompt.value) return

      continueDialogue(index ?? activeChoice.value)

      showChoices.value = false
      activeChoice.value = 0
    }

    return {
      isMobile,
      showChoices,
      showDialogue,
      message,
      onPromptSubmit,
      onChoiceChosen,
      onMessageConfirm
    }
  },

  props: {
    speed: {
      type: Number,
      default: 50
    }
  },
})
</script>

<style lang="scss">
.dialogue {
  &__container {
    margin: auto;
    max-width: 600px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    position: relative;
  }

  &__choices {
    width: 100%;
    max-width: 300px;
  }

  @keyframes underscore {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .choices-enter-active,
  .choices-leave-active {
    transition: opacity .2s ease, transform .2s ease;
  }

  .choices-enter-from,
  .choices-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.dialogue-text {
  color: white;
  font-family: 'Source Code Variable';

  &--body {
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 1px;
  }

  &--choice {
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: 1px;
  }

  &--subhead {
    display: block;
    font-size: 14px;
    font-weight: 800;
    line-height: 24px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  @include responsive(desktop) {
    &--body {
      font-size: 14px;
    }
    &--choice {
      font-size: 14px;
    line-height: 24px;
    }
    &--subhead {
      font-size: 16px;
    }
  }
}
</style>
