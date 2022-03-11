<template>
  <div class="interaction" v-if="showInteraction">
    <theme-provider theme="light">
      <g-button class="interaction__button">
        {{ closestInteraction?.actionName }}
      </g-button>
    </theme-provider>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInteraction, useGameplay, useTime, useInput } from '@/store'

const { interactions } = useInteraction()
const { isPaused, player } = useGameplay()
const { update } = useTime()
const { buttonDown } = useInput()
const closestInteraction = ref(null)

const showInteraction = computed(() => !isPaused.value && !!closestInteraction.value)

update(() => {
  if (isPaused.value) return
  if (!player.value) return

  const playerPos = player.value.transform.position

  const interaction = interactions.value
    .find(interaction => interaction.transform.position
        .distanceTo(playerPos) < interaction.radius / 2 
    )

  closestInteraction.value = interaction
})

buttonDown(({ button }) => {
  if (button !== 'confirm') return
  if (!showInteraction.value) return

  closestInteraction.value?.callback()
})
</script>

<style lang="scss">
.interaction {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  &__circle {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 80px;
    background: rgba(black, .8);
    cursor: pointer;

    &:before {
      position: absolute;
      width: 40px;
      height: 40px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid white;
    }
  }
}
</style>
