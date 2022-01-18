import http from '@/http'

export default {
  async list () {
    const { response, body } = await http.get('/microservices')
    const error = response.status >= 300

    return [ error, body ]
  },
}
