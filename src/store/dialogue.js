import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import socket from '@/socket'

const message = ref({})
const showDialogue = ref(false)

const setMessage = value => message.value = value
const openDialogue = () => showDialogue.value = true
const closeDialogue = () => showDialogue.value = false

const continueDialogue = (index = 0) => {
  socket.emit('dialogue:choose', index)
}

const onDialogueChange = (message) => {
  if (!message)
    return closeDialogue()

  if (!showDialogue.value)
    openDialogue()

  setMessage(message)
}

const onDialogueEnd = () => onDialogueChange(false)

export const initDialogue = () => {
  onMounted(() => {
    socket.on('dialogue:start', onDialogueChange)
    socket.on('dialogue:next', onDialogueChange)
    socket.on('dialogue:end', onDialogueEnd)
  })

  onBeforeUnmount(() => {
    socket.off('dialogue:start', onDialogueChange)
    socket.off('dialogue:next', onDialogueChange)
    socket.off('dialogue:end', onDialogueEnd)
  })
}

export const useDialogue = () => ({
  message: computed(() => message.value),
  showDialogue: computed(() => showDialogue.value),
  choices: computed(() => message.value.choices || []),

  openDialogue,
  closeDialogue,
  continueDialogue,
})
