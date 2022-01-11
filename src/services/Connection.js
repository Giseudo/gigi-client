import io from 'socket.io-client'

// const socket = io('ws://192.168.15.21:3000')
const socket = io('ws://134.122.31.209')

socket.on('message', text => {
  console.log('message', text)
})

document.addEventListener('click', () => {
  socket.emit('message', 'oieeeeeee')
})
