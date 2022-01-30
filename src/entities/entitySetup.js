import { onMounted, ref, provide, inject } from 'vue'
import { Vector3 } from 'three'
import { useGame } from '@/store'

const TRANSFORM = 'entity/TRANSFORM'
const LOOK_AT = 'entity/LOOK_AT'
const MOVE_TO = 'entity/MOVE_TO'
const UPDATE = 'entity/UPDATE'

export const initEntity = ({ speed = 2 }) => {
  const { update } = useGame()

  const transform = ref(null)
  const desiredPosition = new Vector3()
  const lookAtTarget = ref(null)
  const lookAtOffset = new Vector3()
  const positionOffset = new Vector3()

  const moveTo = (position) => {
    const { x, y, z } = position

    desiredPosition.set(
      x ?? desiredPosition.x,
      y ?? desiredPosition.y,
      z ?? desiredPosition.z
    )
  }

  const lookAt = (target) => {
    lookAtTarget.value = target
  }

  update((_, deltaTime) => {
    const smoothPosition = transform.value.position.clone()
      .lerp(desiredPosition, deltaTime * speed)

    const { x, y, z } = smoothPosition

    transform.value.position
      .set(x, y, z)
      .add(positionOffset)

    if (lookAtTarget.value)
      transform.value.lookAt(
        lookAtTarget.value.position
          .clone()
          .add(lookAtOffset)
      )
  })

  onMounted(() => {
    if (transform.value.group)
      transform.value = transform.value.group

    if (transform.value.mesh)
      transform.value = transform.value.mesh
  })

  provide(TRANSFORM, transform)
  provide(LOOK_AT, lookAt)
  provide(MOVE_TO, moveTo)
  provide(UPDATE, update)

  return {
    transform,
    lookAt,
    moveTo,
    update,
    lookAtOffset,
    positionOffset,
  }
}

export const useEntity = () => {
  return {
    transform: inject(TRANSFORM),
    lookAt: inject(LOOK_AT),
    moveTo: inject(MOVE_TO),
    update: inject(UPDATE),
  }
}
