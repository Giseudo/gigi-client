import { Pathfinding } from 'three-pathfinding'

const pathfinding = new Pathfinding()

const createZone = (name, geometry) => {
  const zone = Pathfinding.createZone(geometry)

  pathfinding.setZoneData(name, zone)
}

let previousNode = null

const clampStep = (zone, position, newPosition) => {
  const group = pathfinding.getGroup(zone, position)

  if (group === null) return

  const node = pathfinding.getClosestNode(newPosition, zone, group, true)
    || previousNode

  if (node === null) return

  previousNode = pathfinding.clampStep(
    position.clone(),
    newPosition,
    node,
    zone,
    group,
    position
  )
}

export const useNavmesh = () => ({
  pathfinding,
  createZone,
  clampStep
})
