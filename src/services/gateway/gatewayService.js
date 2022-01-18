import http from '@/http'

export default {
  async fetch () {
    const { response, body } = await http.get('/services')
    const error = response.status >= 300

    return [ error, body ]
  },
}
