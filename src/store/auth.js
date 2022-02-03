import { ref, computed } from 'vue'
import { authService } from '@/services/auth'
import http from '@/http'
import socket from '@/socket'

const token = ref(null)
const user = ref({})

const setToken = value => token.value = value
const setUser = value => user.value = value

const authenticate = (token, user) => {
  setToken(token)
  setUser(user)

  http.setToken(token)
  localStorage.setItem('token', token)

  socket.auth.token = token
  socket.disconnect().connect()
}

const login = async (id) => {
  const [ errors, data ] = await authService.login(id)

  if (!errors) {
    const { token, user } = data

    authenticate(token, user)
  }

  return { errors, data }
}

const register = async ({ username, email }) => {
  const [ errors, data ] = await authService.register(username, email)

  if (!errors) {
    const { token, user } = data

    authenticate(token, user)
  }

  return { errors, data }
}

export const useAuth = () => ({
  login,
  register,
  token: computed(() => token.value),
  user: computed(() => user.value),
})
