import { ref, computed } from 'vue'
import service from './authService'

const token = ref(null)
const user = ref({})

const setToken = value => token.value = value
const setUser = value => user.value = value
const getToken = computed(() => token.value)
const getUser = computed(() => user.value)

const login = async (id) => {
  const { token, user } = await service.login(id)

  if (!token) return false

  setToken(token)
  setUser(user)

  return { token, user }
}

const register = async ({ username, email }) => {
  const { token, user } = await service.register(username, email)

  if (!token) return false

  setToken(token)
  setUser(user)

  return { token, user }
}

export const useAuthService = () => ({
  login,
  register,
  token: getToken,
  user: getUser,
})

