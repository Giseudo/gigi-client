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

    <WarningSign
      :position="{ x: -6, y: 1, z: -1.5 }"
      :rotation="{ y: Math.PI / 2 }"
    />

    <WarningSign
      :position="{ x: 6, y: 1, z: -1.5 }"
      :rotation="{ y: -Math.PI / 2 }"
    />

    <RouterPanel
      :position="{ z: -8.5 }"
      @interact="$emit('router-panel:start', $event)"
      @close="$emit('router-panel:end')"
    />

    <NavmeshProvider v-if="navmesh" :mesh="navmesh" zone="metro-station">
      <slot />
    </NavmeshProvider>
  </Group>
</template>

<script>
import { Vector3 } from 'three'
import { defineComponent, ref } from 'vue'
import { MetroGate } from '../MetroGate'
import { RouterPanel } from '../RouterPanel'
import { WarningSign } from '../WarningSign'
import { metroStationModel } from './'
import { BlockShaderMaterial, StripesShaderMaterial } from '@/world/materials'

export default defineComponent({
  name: 'MetroStation',

  emits: [ 'load', 'gate-in', 'gate-out', 'router-panel:start', 'router-panel:end' ],

  components: { MetroGate, RouterPanel, WarningSign },

  setup (_, { emit }) {
    const transform = ref(null)
    const zoneName = 'metro-station'
    const navmesh = ref(null)
    const material = new BlockShaderMaterial({ color: '#01032e' })
    const panelMaterial = new BlockShaderMaterial({ color: '#363638' })
    const stripesMaterial = new StripesShaderMaterial({ margin: .25, color: 0xffbb00, fade: 1 })

    const onLoadModel = (model) => {
      model.traverse(node => {
        if (node.type === 'Mesh') {
          if (node.name === 'Plane') {
            node.material.dispose()
            node.material = stripesMaterial

            return
          }

          if (node.name === 'Navmesh') {
            navmesh.value = node

            node.material.transparent = true
            node.material.opacity = 0

            return
          }

          if ([ 'Panel', 'Cylinder' ].includes(node.name)) {
            node.material = panelMaterial

            return
          }

          node.material.dispose()
          node.material = material
        }

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

    return {
      transform,
      metroStationModel,
      onLoadModel,
      onGateInteract,
      zoneName,
      gates,
      navmesh,
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
