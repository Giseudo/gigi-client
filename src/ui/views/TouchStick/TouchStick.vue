<template>
  <g-touch-stick @move="onTouchMove" />
</template>

<script>
import { defineComponent } from 'vue'
import { useInput } from '@/store'

export default defineComponent({
  name: 'TouchStick',

  setup () {
    const { setPrimaryAxis } = useInput()

    const onTouchMove = (direction) => {
      setPrimaryAxis(direction)
    }

    return {
      onTouchMove
    }
  }
})
</script>
