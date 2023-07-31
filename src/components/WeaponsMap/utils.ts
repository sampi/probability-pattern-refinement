import { Position } from 'reactflow'

import type { Node, XYPosition } from 'reactflow'

export type MinimalFromNode = Pick<
  Node,
  'width' | 'height' | 'positionAbsolute'
>
export type MinimalToNode = Pick<Node, 'positionAbsolute'>

/**
 * @see https://reactflow.dev/docs/examples/edges/floating-edges/
 */

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode: MinimalFromNode,
  targetNode: MinimalToNode,
): XYPosition {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode
  const targetPosition = targetNode.positionAbsolute

  if (
    intersectionNodeWidth == null ||
    intersectionNodeHeight == null ||
    intersectionNodePosition == null ||
    targetPosition == null
  ) {
    return { x: 0, y: 0 }
  }

  const w = intersectionNodeWidth / 2
  const h = intersectionNodeHeight / 2

  const x2 = intersectionNodePosition.x + w
  const y2 = intersectionNodePosition.y + h
  const x1 = targetPosition.x + w
  const y1 = targetPosition.y + h

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h)
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h)
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1))
  const xx3 = a * xx1
  const yy3 = a * yy1
  const x = w * (xx3 + yy3) + x2
  const y = h * (-xx3 + yy3) + y2

  return { x, y }
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(
  node: MinimalFromNode,
  intersectionPoint: XYPosition,
): Position {
  const n = { ...node.positionAbsolute, ...node }

  if (n.x == null || n.y == null || n.width == null || n.height == null) {
    return Position.Top
  }

  const nx = Math.round(n.x)
  const ny = Math.round(n.y)
  const px = Math.round(intersectionPoint.x)
  const py = Math.round(intersectionPoint.y)

  if (px <= nx + 1) {
    return Position.Left
  }
  if (px >= nx + n.width - 1) {
    return Position.Right
  }
  if (py <= ny + 1) {
    return Position.Top
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom
  }

  return Position.Top
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(
  source: MinimalFromNode,
  target: MinimalToNode,
): {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
} {
  const sourceIntersectionPoint = getNodeIntersection(source, target)
  const targetIntersectionPoint = getNodeIntersection(target, source)

  const sourcePosition = getEdgePosition(source, sourceIntersectionPoint)
  const targetPosition = getEdgePosition(target, targetIntersectionPoint)

  return {
    sourceX: sourceIntersectionPoint.x,
    sourceY: sourceIntersectionPoint.y,
    targetX: targetIntersectionPoint.x,
    targetY: targetIntersectionPoint.y,
    sourcePosition,
    targetPosition,
  }
}
