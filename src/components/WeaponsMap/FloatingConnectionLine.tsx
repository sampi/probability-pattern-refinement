import { getStraightPath } from 'reactflow'

import { getEdgeParams } from './utils'

import type { ReactNode } from 'react'
import type { ConnectionLineComponentProps } from 'reactflow'

function FloatingConnectionLine({
  toX,
  toY,
  fromNode,
}: ConnectionLineComponentProps): ReactNode {
  if (fromNode == null) {
    return null
  }

  const targetNode = {
    id: 'connection-target',
    width: 1,
    height: 1,
    positionAbsolute: { x: toX, y: toY },
  }

  const { sourceX, sourceY } = getEdgeParams(fromNode, targetNode)
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX: toX,
    targetY: toY,
  })

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  )
}

export default FloatingConnectionLine
