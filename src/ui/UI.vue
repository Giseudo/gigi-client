<template>
  <GDialogue ref="dialogue"
    v-if="showDialogue"
    :text="message.text"
    :choices="message.choices"
    :speaker="message.speaker"
    @continue="onDialogueContinue"
    @prompt="onDialogueReply"
  />
</template>

<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAuth, initDialogue, useDialogue, useInput } from '@/store'
import { GDialogue } from '@/components'
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
