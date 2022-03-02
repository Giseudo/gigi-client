<template>
  <Group ref="transform" :position="position">
    <FbxModel
      :src="metroStationModel"
      @load="onLoadModel"
    />

    <MetroGate
      v-for="(gate, index) in gates"
      :key="index"
      :ref="(el) => gates[index].component = el"
      :position="gate.position"
      :direction="gate.direction"
      @interact="onGateInteract(gate, $event)"
      @click="onGateClick(gate)"
    />

    <RouterPanel
      :position="{ z: 0 }"
      @interact="$emit('router-panel', $event)"
    />

    <NavmeshProvider v-if="navmesh" :mesh="navmesh" zone="metro-station">
      <slot />
    </NavmeshProvider>
  </Group>
</template>

<script>
import { Vector3 } from 'three'
import { defineComponent, ref, inject } from 'vue'
import { useNavmesh } from '@/store'
import { MetroGate } from '../MetroGate'
import { RouterPanel } from '../RouterPanel'
import { metroStationModel } from './'

export default defineComponent({
  name: 'MetroStation',

  emits: [ 'load', 'gate-in', 'gate-out', 'router-panel' ],

  components: { MetroGate, RouterPanel },

  setup (_, { emit }) {
    const { createZone } = useNavmesh()
    const transform = ref(null)
    const isInside = inject('isInside', false)
    const zoneName = 'metro-station'
    const navmesh = ref(null)

    const onLoadModel = (model) => {
      model.traverse(node => {
        if (node.name === 'Navmesh') {
          createZone(zoneName, node.geometry)
          navmesh.value = node

          // node.material.transparent = true
          // node.material.opacity = 0
        }

        if (node.type === 'Mesh')
          node.material.shininess = 0

        if (node.type === 'PointLight')
          node.intensity = .25
      })

      emit('load', model)
    }

    const gates = ref([
      {
        position: { x: -2.7, y: 0, z: 8.2 },
        direction: 'out',
        component: null
      },
      {
        position: { x: -1.35, y: 0, z: 8.2 },
        direction: 'in',
        component: null
      },
      {
        position: { x: -0.01, y: 0, z: 8.2 },
        direction: 'in',
        component: null
      },
      {
        position: { x: 1.33, y: 0, z: 8.2 },
        direction: 'in',
        component: null
      },
      {
        position: { x: 2.61, y: 0, z: 8.2 },
        direction: 'in',
        component: null
      },
    ])

    const onGateInteract = (gate) => {
      if (gate.direction === 'in')
        emit('gate-in', gate.component)

      if (gate.direction === 'out')
        emit('gate-out', gate.component)
    }

    /*
    const onGateClick = (gate) => moveToAndInteract(
      gate.transform.position,
      () => onGateInteract(gate)
    )
    */

    return {
      transform,
      metroStationModel,
      onLoadModel,
      onGateInteract,
      zoneName,
      gates,
      navmesh
    }
  },

  props: {
    position: {
      type: [ Object, Vector3 ],
      default: () => ({ x: 0, y: 0, z: 0 })
    }
  },
})
</script>
