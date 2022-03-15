<template>
  <div class="ui">
    <alerts class="ui__alert" />
    <dialogue class="ui__dialogue" />
    <touch-stick class="ui__touch-stick" v-if="player && !isPaused" />
    <interaction class="ui__interaction" />
  </div>
</template>

<script setup>
import Alerts from './views/Alert/Alert.vue'
import Dialogue from './views/Dialogue/Dialogue.vue'
import TouchStick from './views/TouchStick/TouchStick.vue'
import Interaction from './views/Interaction/Interaction.vue'
import { useGameplay } from '@/store'

const { player, isPaused } = useGameplay()
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
