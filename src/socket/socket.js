import io from 'socket.io-client'

export const socket = io('ws://' + import.meta.env.VITE_SERVER_ADDRESS)

export default {
  // do handshake
  // handle authentication
  // store token

  on: () => {

  },

  emit: () => {

  },
}
