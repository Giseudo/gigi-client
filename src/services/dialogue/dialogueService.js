import { socket } from '@/socket'

export default {
  callback: () => {},

  async init (callback) {
    if (callback)
      this.callback = callback

    this.onStartDialogue = this.onStartDialogue.bind(this)
    this.onNextDialogue = this.onNextDialogue.bind(this)
    this.onEndDialogue = this.onEndDialogue.bind(this)

    socket.on('dialogue:start', this.onStartDialogue)
    socket.on('dialogue:next', this.onNextDialogue)
    socket.on('dialogue:end', this.onEndDialogue)
  },

  destroy () {
    socket.off('dialogue:start', this.onStartDialogue)
    socket.off('dialogue:next', this.onNextDialogue)
    socket.off('dialogue:end', this.onEndDialogue)
  },

  interact () {
    socket.emit('interact')
  },

  choose (index) {
    socket.emit('dialogue:choose', index)
  },

  onStartDialogue (message) {
    this.callback(message)
  },

  onNextDialogue (message) {
    this.callback(message)
  },

  onEndDialogue () {
    this.callback(false)
  },
}
