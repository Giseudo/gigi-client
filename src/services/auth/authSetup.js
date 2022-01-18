import { ref, computed } from 'vue'
import service from './authService'

const token = ref(null)
const user = ref({})

const setToken = value => token.value = value
const setUser = value => user.value = value
const getToken = computed(() => token.value)
const getUser = computed(() => user.value)

const login = async (id) => {
  const [ error, data ] = await service.login(id)

  if (!error) {
    const { token, user } = data

    setToken(token)
    setUser(user)
  }

  return { error, data }
}

const register = async ({ username, email }) => {
  const [ error, data ] = await service.register(username, email)

  if (!error) {
    const { token, user } = data

    setToken(token)
    setUser(user)
  }

  return { error, data }
}

export const useAuthService = () => ({
  login,
  register,
  token: getToken,
  user: getUser,
})

