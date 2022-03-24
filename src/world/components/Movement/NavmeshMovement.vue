<template>
  <slot />
</template>

<script setup>
import { defineExpose, defineProps, inject, ref } from 'vue'
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
const findPath = inject('navmesh/findPath')
const deltaTime = inject(DeltaTimeKey)
const direction = new Vector3()
const smoothDirection = new Vector3()
const path = ref([])

const move = ({ x, y }) => direction.set(x, 0, y)
const moveTo = (position) => {
  path.value = findPath(transform.value.position, position)

  return path
}

update(() => {
  if (path.value.length) followPath()

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

const followPath = () => {
  if (!path.value.length) return

  const [ nextPosition ] = path.value

  if (transform.value.position.distanceTo(nextPosition) > .5)
    return direction.copy(transform.value.position)
      .sub(nextPosition)
      .setY(0)
      .normalize()
      .setX(direction.x * -1)

  path.value.shift()

  if (!path.value.length)
    direction.set(0, 0, 0)
}

defineExpose({
  move,
  moveTo
})
</script>
