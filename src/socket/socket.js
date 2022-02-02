import io from 'socket.io-client'

export const socket = io('ws://' + import.meta.env.VITE_SERVER_ADDRESS, {
  auth: { token: null },
  query: { sessionId: null }
})

export default {
  // do handshake
  // handle authentication
  // store token

  on: () => {

  },

  emit: () => {

  },
}
