<template>
  <slot />
</template>

<script setup>
import { defineExpose, defineProps, inject } from 'vue'
import { Vector3 } from 'three'
import { DeltaTimeKey, useTime, useGameplay } from '@/store'
import { MeshInjectionKey } from 'troisjs'

const { update } = useTime()
const { boundaries } = useGameplay()

const props = defineProps({
  speed: {
    type: Number,
    default: 4
  }
})

const transform = inject(MeshInjectionKey)
const clampStep = inject('navmesh/clampStep')
const deltaTime = inject(DeltaTimeKey)
const direction = new Vector3()
const smoothDirection = new Vector3()

const move = ({ x, y }) => direction.set(x, 0, y)

update(() => {
  const { x, z } = direction

  if (x === 0 && z === 0) return

  const { position } = transform.value
  const newPosition = position.clone()

  newPosition.x += x * deltaTime.value * props.speed
  newPosition.z -= z * deltaTime.value * props.speed

  boundaries.value.clampPoint(
    newPosition,
    newPosition,
  )

  clampStep(
    transform.value.position,
    newPosition
  )

  const desiredDirection = position.clone()

  desiredDirection.x += x
  desiredDirection.z -= z

  smoothDirection.lerpVectors(
    smoothDirection,
    desiredDirection,
    deltaTime.value * 5
  )
  smoothDirection.y = position.y

  transform.value.lookAt(smoothDirection)
})


defineExpose({
  move
})
</script>
