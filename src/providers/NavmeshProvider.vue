<template>
  <slot />
</template>

<script setup>
import { defineProps, onMounted, provide } from 'vue'
import { Pathfinding } from 'three-pathfinding'

const NAVMESH_CLAMP_STEP = 'navmesh/clampStep'

const props = defineProps({
  mesh: Object,
  zone: String
})

let previousNode = null
const pathfinding = new Pathfinding()

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

  const node = pathfinding.getClosestNode(newPosition, props.zone, group, true)
    || previousNode

  if (node === null) return

  previousNode = pathfinding.clampStep(
    position.clone(),
    newPosition,
    node,
    props.zone,
    group,
    position
  )
}

provide(NAVMESH_CLAMP_STEP, clampStep)
</script>
