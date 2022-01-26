import { ref, computed } from 'vue'
import service from './dialogueService'

// state
const message = ref({})
const showDialogue = ref(false)
const interactedWithPod = ref(false)

// getters
const getMessage = computed(() => message.value)
const getShowDialogue = computed(() => showDialogue.value)
const getInteractedWithPod = computed(() => interactedWithPod.value)

// mutations
const setMessage = value => message.value = value
const openDialogue = () => showDialogue.value = true
const closeDialogue = () => showDialogue.value = false
const toggleDialogue = () => showDialogue.value = !showDialogue.value

// actions
const interact = () => {
  service.interact()
}

const continueDialogue = (index = 0) => {
  service.choose(index)
}

export const initDialogueService = async () => {
  const onDialogueChange = (message) => {
    if (!message) {
      interactedWithPod.value = true
      return closeDialogue()
    }

    if (!showDialogue.value)
      openDialogue()

    setMessage(message)
  }

  await service.init(onDialogueChange)
}

export const destroyDialogueService = async () => {
  service.destroy()
}

export const useDialogueService = () => ({
  message: getMessage,
  showDialogue: getShowDialogue,
  interactedWithPod: getInteractedWithPod,

  openDialogue,
  closeDialogue,
  toggleDialogue,

  initDialogueService,
  destroyDialogueService,
  interact,
  continueDialogue,
})
