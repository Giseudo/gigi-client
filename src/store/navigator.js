import { computed, ref, provide, inject } from 'vue'
import { EventDispatcher } from 'three'

const TIME_INTERVAL = 1 / 3

const SUBSCRIBE = 'navigator/subscribe'
const UNSUBSCRIBE = 'navigator/unsubscribe'
const IS_CONNECTED = 'navigator/isConnected'
const USER_AGENT = 'navigator/userAgent'
const CONNECT_USER_AGENT = 'navigator/connectUserAgent'

const timer = ref(0)

export const initNavigator = () => {
  const dispatcher = new EventDispatcher()
  const isConnected = ref(false)
  const userAgent = ref(null)

  const connectUserAgent = (value) => {
    isConnected.value = true
    userAgent.value = value
  }

  const subscribe = (type, callback) => dispatcher.addEventListener(type, callback)
  const unsubscribe = (type, callback) => dispatcher.removeEventListener(type, callback)
  const previousPosition = ref({})

  const onRender = () => {
    timer.value += Math.min(.0166, .1)

    if (timer.value > TIME_INTERVAL) {
      const userPosition = userAgent.value?.position

      if (!userPosition)
        return window.requestAnimationFrame(onRender)

      if (!userPosition.equals(previousPosition.value))
        dispatcher.dispatchEvent({
          type: 'user-move',
          message: userAgent.value?.position
        })

      previousPosition.value = userPosition.clone()
      timer.value %= TIME_INTERVAL
    }

    window.requestAnimationFrame(onRender)
  }

  onRender()

  provide(SUBSCRIBE, subscribe)
  provide(UNSUBSCRIBE, unsubscribe)
  provide(IS_CONNECTED, computed(() => isConnected.value))
  provide(USER_AGENT, computed(() => userAgent.value))
  provide(CONNECT_USER_AGENT, connectUserAgent)
}

export const useNavigator = () => ({
  subscribe: inject(SUBSCRIBE),
  unsubscribe: inject(UNSUBSCRIBE),
  connected: inject(IS_CONNECTED),
  userAgent: inject(USER_AGENT),
  connectUserAgent: inject(CONNECT_USER_AGENT),
})
