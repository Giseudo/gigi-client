import { useAuthService } from '@/services/auth'

export default {
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/api`,

  headers: {
    'Content-Type': 'application/json'
  },

  async request (url, method, headers = {}, data) {
    const { token } = useAuthService()

    if (token)
      headers['Authorization'] = `Bearer ${token.value}`

    const options = {
      method,
      headers: {
        ...this.headers,
        ...headers
      }
    }

    if (data)
      options.body = JSON.stringify(data)

    const response = await fetch(this.baseUrl + url, options)

    // TODO handle errors (maybe create a logger module?)
    const body = await response.json()

    return { response, body }
  },

  async get (url, headers) {
    return await this.request(url, 'GET', headers)
  },

  async post (url, data, headers) {
    return await this.request(url, 'POST', headers, data)
  },

  async put (url, data, headers) {
    return await this.request(url, 'PUT', headers, data)
  },

  async delete (url, headers) {
    return await this.request(url, 'DELETE', headers)
  },
}
