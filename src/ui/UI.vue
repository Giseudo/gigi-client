<template>
  <div class="ui">
    <alert class="ui__alert" />
    <dialogue class="ui__dialogue" />
    <touch-stick class="ui__touch-stick" />
    <interaction class="ui__interaction" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Alert from './views/Alert/Alert.vue'
import Dialogue from './views/Dialogue/Dialogue.vue'
import TouchStick from './views/TouchStick/TouchStick.vue'
import Interaction from './views/Interaction/Interaction.vue'

export default defineComponent({
  name: 'UI',

  components: {
    Alert,
    Dialogue,
    TouchStick,
    Interaction,
  },

  setup () {
    /*
    const { buttonDown } = useInput()
    const { update } = useGame()
    const { player } = useGameplay()
    const { interactions } = useInteraction()
    const isInteracting = ref(false)
    const currentInteraction = ref(null)

    buttonDown(({ button }) => {
      if (isInteracting.value) return
      if (button !== 'confirm') return

      currentInteraction.value?.callback()
      isInteracting.value = true
    })

    socket.on('interaction:end', () => isInteracting.value = false)

    update(() => {
    */
      /*
      if (!player.value) return

      const interaction = interactions.value
        .find(interaction => {
          const playerPos = player.value.transform.position

          return interaction.transform.position
            .distanceTo(playerPos) < interaction.radius / 2 
        })

      if (!interaction)
        isInteracting.value = false

      currentInteraction.value = interaction
      */
    //})
  }
})
</script>

<style lang="scss">
.ui {
  &__dialogue {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    z-index: 10;

    @include responsive(desktop) {
      bottom: 40px;
      left: 20px;
      right: 20px;
    }
  }

  &__interaction {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 5;
  }
}
</style>
