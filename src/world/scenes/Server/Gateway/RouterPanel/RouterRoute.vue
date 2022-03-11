<template>
  <Box :scale="scale" :position="position">
    <BlockMaterial :displace="displace" />
  </Box>
</template>

<script setup>
const position = { x: 0, y: 1, z: 0 }
const scale = { x: .5, y: 1, z: .1 }
const displace = { x: 0, y: 0, z: .1 }
</script>
