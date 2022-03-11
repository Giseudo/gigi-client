import { ref, computed } from 'vue'

const title = ref('')
const message = ref('')
const showAlert = ref(false)
const confirmText = ref('')
const cancelText = ref('')
const confirmCallback = ref(undefined)
const cancelCallback = ref(undefined)
const closeCallback = ref(undefined)
const theme = ref('light')

const openAlert = (params) => {
  const { onConfirm, onCancel, onClose } = params

  title.value = params.title || 'Alert'
  message.value = params.message
  confirmText.value = params.confirmText || 'Confirm'
  cancelText.value = params.cancelText || 'Cancel'
  theme.value = params.dark ? 'dark' : 'light'

  confirmCallback.value = onConfirm
  cancelCallback.value = onCancel
  closeCallback.value = onClose

  showAlert.value = true
}

const confirmAlert = async () => {
  if (confirmCallback.value)
    await new Promise(resolve => confirmCallback.value(resolve))

  closeAlert()
}

const cancelAlert = () => {
  if (cancelCallback.value)
    cancelCallback.value()

  closeAlert()
}

const closeAlert = () => {
  if(closeCallback.value)
    closeCallback.value()

  showAlert.value = false
}

export const useAlert = () => ({
  title: computed(() => title.value),
  message: computed(() => message.value),
  showAlert: computed(() => showAlert.value),
  confirmText: computed(() => confirmText.value),
  cancelText: computed(() => cancelText.value),
  theme: computed(() => theme.value),

  openAlert,
  closeAlert,
  cancelAlert,
  confirmAlert,
})
