import { ref, computed } from 'vue'
import gatewayService from './gatewayService'

const services = ref([])

const getServices = computed(() => services.value)
const setServices = value => services.value = value.map(service => ({
  ...service,
  thumbnail: process.env.VUE_APP_PUBLIC_URL + '/textures/services/' + service.thumbnail
}))

const fetchServices = async () => {
  const [ error, data ] = await gatewayService.fetch()

  if (!error) {
    const { services } = data

    setServices(services)
  }

  return [ error, data ]
}

export const useGatewayService = () => ({
  fetchServices,
  services: getServices,
})
