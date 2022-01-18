import http from '@/http'

export default {
  async login (id) {
    const input = { id }
    const { response, body } = await http.post('/auth/login', input)

    return [ response.status >= 300, body ]
  },

  async register (username, email) {
    const input = { username, email }
    const { response, body } = await http.post('/auth/register', input)

    return [ response.status >= 300, body ]
  },
}
