import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import socket from '@/socket'

// state
const message = ref({})
const showDialogue = ref(false)

// getters
const getMessage = computed(() => message.value)
const getShowDialogue = computed(() => showDialogue.value)

// mutations
const setMessage = value => message.value = value
const openDialogue = () => showDialogue.value = true
const closeDialogue = () => showDialogue.value = false
const toggleDialogue = () => showDialogue.value = !showDialogue.value

// actions
const continueDialogue = (index = 0) => {
  socket.emit('dialogue:choose', index)
}

export const initDialogue = () => {
  const onDialogueChange = (message) => {
    if (!message)
      return closeDialogue()

    if (!showDialogue.value)
      openDialogue()

    setMessage(message)
  }

  const onDialogueEnd = () => onDialogueChange(false)

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
  message: getMessage,
  showDialogue: getShowDialogue,

  openDialogue,
  closeDialogue,
  toggleDialogue,

  continueDialogue,
})
