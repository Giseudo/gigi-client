<template>
  <div class="dialogue" v-if="showDialogue">
    <div class="dialogue__container">
      <dialogue-choices
        class="dialogue__choices"
        @choose="onChoiceChosen"
      />

      <dialogue-prompt
        class="dialogue__prompt"
        @start="onPromptStart"
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
import { defineComponent, ref, provide, computed } from 'vue'
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
    const startPrompt = ref(false)

    provide('dialogue/activeChoice', activeChoice)
    provide('dialogue/showChoices', showChoices)
    provide('dialogue/showPrompt', showPrompt)
    provide('theme', computed(() => 'light'))

    const onMessageConfirm = () => {
      if (startPrompt.value)
        return showPrompt.value = true

      if (!showChoices.value && choices.value.length > 1)
        return showChoices.value = true

      choose()
    }

    const onChoiceChosen = () => {
      choose()
    }

    const onPromptStart = () => {
      startPrompt.value = true
    }

    const onPromptSubmit = async ({ identifier, value }) => {
      if (identifier === 'request-access-code')
        await login(value)

      showPrompt.value = false
      startPrompt.value = false

      choose()
    }

    const choose = (index) => {
      if (showPrompt.value) return

      continueDialogue(index ?? activeChoice.value)

      showChoices.value = false
      setTimeout(() => activeChoice.value = 0, 200)
    }

    return {
      isMobile,
      showChoices,
      showDialogue,
      message,
      onPromptStart,
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
</style>
