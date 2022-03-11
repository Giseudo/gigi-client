import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

const interactions = ref([])
const activeId = ref(null)
const selected = computed(() => interactions.find(({ id }) => id === activeId) || {})

// actionName: Talk, Open, Push, Plug
// Identifier
const createInteraction = (id, actionName, transform, radius = 2, callback = () => {}) => {
  const interaction = {
    id, actionName, transform, radius, callback
  }

  onMounted(() => {
    interactions.value.push(interaction)
  })

  onBeforeUnmount(() => {
    const index = interactions.value
      .findIndex(interaction => interaction.id === id)

    if (index < 0) return

    interactions.value.splice(index, 1)
  })
}

export const useInteraction = () => ({
  interactions: computed(() => interactions.value),
  selectedInteraction: computed(() => selected.value),
  createInteraction,
})
