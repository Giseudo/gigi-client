<template>
  <div class="ui">
    <g-dialogue ref="dialogue"
      class="ui__dialogue"
      v-if="showDialogue"
      :text="message.text"
      :choices="message.choices"
      :speaker="message.speaker"
      @continue="onDialogueContinue"
      @prompt="onDialogueReply"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAuth, initDialogue, useDialogue, useInput } from '@/store'
import { GDialogue } from '@/ui/components'
import socket from '@/socket'

export default defineComponent({
  name: 'UI',

  components: {
    GDialogue,
  },

  setup () {
    const { message, showDialogue, continueDialogue } = useDialogue()
    const { axis, buttonDown } = useInput()
    const { login } = useAuth()

    const dialogue = ref(null)
    const questionIdentifier = ref(null)

    initDialogue()

    onMounted(() =>
      socket.on('dialogue:prompt', onDialoguePrompt)
    )

    onBeforeUnmount(() =>
      socket.off('dialogue:prompt', onDialoguePrompt)
    )

    buttonDown(({ button }) => {
      if (button === 'confirm') {
        dialogue.value?.confirm()
      }
    })

    watch(axis.value, (value) => {
      const { y } = value

      if (y > 0) dialogue.value?.selectPrevious()
      if (y < 0) dialogue.value?.selectNext()
    })

    const onDialogueContinue = continueDialogue

    const onDialoguePrompt = (identifier, type) => {
      dialogue.value?.prompt(type)

      questionIdentifier.value = identifier
    }

    const onDialogueReply = async (value) => {
      const identifier = questionIdentifier.value

      if (identifier === 'request-access-code')
        await login(value)

      dialogue.value?.confirm()
    }

    return {
      dialogue,
      message,
      showDialogue,
      onDialogueContinue,
      onDialogueReply
    }
  }
})
</script>

<style lang="scss">
.ui {
  &__dialogue {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    z-index: 10;

    @include responsive(desktop) {
      bottom: 40px;
      left: 20px;
      right: 20px;
    }
  }
}
</style>
