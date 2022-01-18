import { ref, computed } from 'vue'
import service from './microserviceService'

const microservices = ref([])

const getMicroservices = computed(() => microservices.value)
const setMicroservices = value => microservices.value = [ ...value ]

const list = async () => {
  const [ error, data ] = await service.list()

  if (!error) {
    const { microservices } = data

    setMicroservices(microservices)
  }

  return [ error, data ]
}

export const useMicroserviceService = () => ({
  list,
  microservices: getMicroservices,
})
