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
    />

    <RouterPanel
      :position="{ z: 0 }"
      @interact="$emit('router-panel', $event)"
    />
  </Group>
</template>

<script>
import { Vector3 } from 'three'
import { defineComponent, ref, inject } from 'vue'
import { useNavmesh, useCamera } from '@/store'
import { MetroGate } from '../MetroGate'
import { RouterPanel } from '../RouterPanel'
import { metroStationModel } from './'
import socket from '@/socket'

export default defineComponent({
  name: 'MetroStation',

  emits: [ 'load', 'open-gate', 'router-panel' ],

  components: { MetroGate, RouterPanel },

  setup (_, { emit }) {
    const { createZone } = useNavmesh()
    const transform = ref(null)
    const isInside = inject('isInside', false)
    const zoneName = 'metro-station'

    const onLoadModel = (model) => {
      model.traverse(node => {
        if (node.name === 'Navmesh') {
          createZone(zoneName, node.geometry)

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
      if (isInside.value) return

      if (gate.direction === 'in') {
        socket.emit('interact', 'metro-gate-in')

        socket.once('interaction:end', () => {
          emit('open-gate', gate.component)
        })
      }

      if (gate.direction === 'out') {
        socket.emit('interact', 'metro-gate-out')
      }
    }

    return {
      transform,
      metroStationModel,
      onLoadModel,
      onGateInteract,
      zoneName,
      gates
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
