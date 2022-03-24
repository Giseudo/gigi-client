<template>
  <slot />
</template>

<script setup>
import { defineProps, onMounted, ref, provide } from 'vue'
import { Pathfinding } from 'three-pathfinding'

const NAVMESH_CLAMP_STEP = 'navmesh/clampStep'
const NAVMESH_FIND_PATH = 'navmesh/findPath'

const props = defineProps({
  mesh: Object,
  zone: String
})

const pathfinding = new Pathfinding()
const previousNode = ref(null)

onMounted (() => {
  const createZone = (name, geometry) => {
    const zone = Pathfinding.createZone(geometry)

    pathfinding.setZoneData(name, zone)
  }

  createZone(props.zone, props.mesh.geometry)
})

const clampStep = (position, newPosition) => {
  const group = pathfinding.getGroup(props.zone, position)

  if (group === null) return

  const node = pathfinding.getClosestNode(
    newPosition,
    props.zone,
    group,
    true
  ) || previousNode.value

  if (node === null) return

  previousNode.value = pathfinding.clampStep(
    position.clone(),
    newPosition,
    node,
    props.zone,
    group,
    position
  )
}

const findPath = (position, targetPosition) => {
  const group = pathfinding.getGroup(props.zone, targetPosition)

  if (group === null) return

  const path = pathfinding.findPath(
    position,
    targetPosition,
    props.zone,
    group
  )

  return path
}

provide(NAVMESH_CLAMP_STEP, clampStep)
provide(NAVMESH_FIND_PATH, findPath)
</script>
