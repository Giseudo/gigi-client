import io from 'socket.io-client'

const address = 'ws://' + import.meta.env.VITE_SERVER_ADDRESS

const socket = io(address, {
  auth: { token: localStorage.getItem('token') },
  query: { sessionId: null }
})

const onSessionStart = (sessionId) => {
  socket.io.opts.query.sessionId = sessionId
}

const onError = (message) => {
  console.log('socket error:', message)
}

socket.on('session', onSessionStart)
socket.on('connection_error', onError)

export default socket
