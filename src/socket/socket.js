import io from 'socket.io-client'

export const socket = io('ws://' + import.meta.env.VITE_SERVER_ADDRESS)
