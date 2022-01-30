import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import service from './dialogueService'

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
  service.choose(index)
}

export const initDialogueService = async () => {
  const onDialogueChange = (message) => {
    if (!message) {
      return closeDialogue()
    }

    if (!showDialogue.value)
      openDialogue()

    setMessage(message)
  }

  onMounted(() => service.init(onDialogueChange))
  onBeforeUnmount(() => service.destroy())
}

export const useDialogueService = () => ({
  message: getMessage,
  showDialogue: getShowDialogue,

  openDialogue,
  closeDialogue,
  toggleDialogue,

  continueDialogue,
})
