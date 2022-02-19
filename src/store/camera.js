import { computed, ref, onMounted } from 'vue'
import { Vector3 } from 'three'
import { useGame } from '@/store'

const camera = ref(null)

const lookAtTarget = ref(null)
const lookAtSpeed = ref(8.0)
const lookAtOffset = new Vector3()
const followTarget = ref(null)
const followSpeed = ref(8.0)
const followOffset = new Vector3()

const setLookAtSpeed = value => lookAtSpeed.value = value
const setFollowSpeed = value => followSpeed.value = value

const setLookAtTarget = value => lookAtTarget.value = value
const setFollowTarget = value => followTarget.value = value

const setLookAtOffset = ({ x = 0, y = 0, z = 0 }) =>
  lookAtOffset.set(x, y, z)

const setFollowOffset = ({ x = 0, y = 0, z = 0 }) =>
  followOffset.set(x, y, z)

const cameraFollow = (target, offset, speed) => {
  setFollowOffset(offset)
  setFollowTarget(target)

  if (speed) setFollowSpeed(speed)
}

const cameraLookAt = (target, offset, speed) => {
  setLookAtOffset(offset)
  setLookAtTarget(target)

  if (speed) setLookAtSpeed(speed)
}

export const initCamera = () => {
  const { update } = useGame()
  const lookAtPosition = new Vector3()

  update((_, deltaTime) => {
    const updatePosition = () => {
      if (!followTarget.value) return

      const desiredPosition = followTarget.value.position.clone()
        .add(followOffset)

      camera.value.position.lerp(
        desiredPosition,
        deltaTime * followSpeed.value
      )
    }

    const updateRotation = () => {
      if (!lookAtTarget.value) return

      const desiredPosition = lookAtTarget.value.position.clone()
        .add(lookAtOffset)

      lookAtPosition.lerp(
        desiredPosition,
        deltaTime * lookAtSpeed.value
      )

      camera.value.lookAt(lookAtPosition)
    }

    updatePosition()
    updateRotation()
  })

  onMounted(() => {
    camera.value = camera.value.camera
  })

  return { camera }
}

export const useCamera = () => ({
  camera: computed(() => camera.value),
  lookAtOffset: computed(() => lookAtOffset.value),
  lookAtTarget: computed(() => lookAtTarget.value),
  setLookAtTarget,
  setLookAtOffset,
  setFollowTarget,
  setFollowOffset,
  cameraFollow,
  cameraLookAt,
})
