import { useCallback } from 'react'
import { useStore, getStraightPath } from 'reactflow'

import { getEdgeParams } from './utils.ts'

import type { ReactNode } from 'react'
import type { EdgeProps } from 'reactflow'

function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
}: EdgeProps): ReactNode {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  )
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  )

  if (sourceNode == null || targetNode == null) {
    return null
  }

  const { sourceX, sourceY, targetX, targetY } = getEdgeParams(
    sourceNode,
    targetNode,
  )

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  )
}

export default FloatingEdge
