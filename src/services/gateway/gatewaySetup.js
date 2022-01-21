import { ref, computed } from 'vue'
import gatewayService from './gatewayService'

// state
const services = ref([])
const activePort = ref(null)

// getters
const getActivePort = computed(() => activePort.value)
const getServices = computed(() => services.value)

// mutations
const setServices = value => services.value = value.map(service => ({
  ...service,
  thumbnail: process.env.VUE_APP_PUBLIC_URL + '/textures/services/' + service.thumbnail
}))

const selectPort = value => {
  activePort.value = value

  return services.value
    .find(service => service.port === value) || {}
}

// actions
const fetchServices = async () => {
  const [ error, data ] = await gatewayService.fetch()

  if (!error) {
    const { services } = data

    setServices(services)
  }

  return [ error, services ]
}

export const useGatewayService = () => ({
  selectPort,
  fetchServices,
  activePort: getActivePort,
  services: getServices,
})
