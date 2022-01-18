import http from '@/http'

export default {
  async login (id) {
    console.log(id)
    const input = { id }
    const response = await http.post('/auth/login', input)

    console.log('login', response)

    return response
  },

  async register (username, email) {
    const input = { username, email }
    const response = await http.post('/auth/register', input)

    console.log('register', response)

    return response
  },
}
