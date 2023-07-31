import { useEffect, useMemo, useRef } from 'react'
import {
  Background,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { COLORS, DEBOUNCE_MS, GRAPH_CIRCLE_RADIUS } from '../../constants'
import { useStore } from '../../store'

import FloatingConnectionLine from './FloatingConnectionLine'
import FloatingEdge from './FloatingEdge'
import { generateCoordinates } from './utils'

import './WeaponsMap.css'

import type { ComponentType, CSSProperties, ReactNode } from 'react'
import type { Edge, EdgeProps, Node } from 'reactflow'

const sharedNodeStyle = (color?: string): CSSProperties => ({
  borderRadius: '50%',
  aspectRatio: '1',
  lineHeight: '8rem',
  fontSize: '1.25rem',
  overflow: 'hidden',
  textAlign: 'center',
  ...(color != null ? { border: `1px solid ${color}` } : {}),
})

const markerEnd = (color?: string): Edge['markerEnd'] => ({
  type: MarkerType.ArrowClosed,
  width: 40,
  height: 40,
  color,
})
const sharedEdgeStyle = (color?: string): Edge['style'] => ({
  stroke: color,
})

const edgeTypes = {
  floating: FloatingEdge as ComponentType<EdgeProps>,
}

function WeaponsMapFlow(): ReactNode {
  const { fitView } = useReactFlow()

  const timeoutRef = useRef<number>(-1)

  useEffect(() => {
    const resizeListener = (): void => {
      if (timeoutRef.current >= 0) {
        window.clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        fitView()
      }, DEBOUNCE_MS)
    }

    window.addEventListener('resize', resizeListener)

    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [fitView])

  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])

  const { weapons, numWeapons } = useStore(({ weapons }) => ({
    weapons,
    numWeapons: Object.getOwnPropertyNames(weapons).length,
  }))

  const coords = useMemo(
    () => generateCoordinates(GRAPH_CIRCLE_RADIUS, numWeapons),
    [numWeapons],
  )

  const newNodesAndEdges = useMemo(() => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    Object.values(weapons).forEach((weapon, index) => {
      const color = COLORS[index % COLORS.length]
      newNodes.push({
        id: weapon.id,
        data: { label: weapon.name },
        position: coords[index],
        style: sharedNodeStyle(color),
      })

      weapon.defeats.forEach((defeatId) => {
        newEdges.push({
          id: `e${weapon.id}-${defeatId}`,
          type: 'floating',
          markerEnd: markerEnd(color),
          source: weapon.id,
          target: defeatId,
          style: sharedEdgeStyle(color),
        })
      })
    })
    return { nodes: newNodes, edges: newEdges }
  }, [coords, weapons])

  useEffect(() => {
    setNodes(newNodesAndEdges.nodes)
    setEdges(newNodesAndEdges.edges)
    fitView()
  }, [fitView, newNodesAndEdges, setEdges, setNodes])

  return (
    <ReactFlow
      className="weapons-circle"
      nodes={nodes}
      edges={edges}
      fitView
      edgeTypes={edgeTypes}
      connectionLineComponent={FloatingConnectionLine}
      panOnDrag={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background />
    </ReactFlow>
  )
}

export function WeaponsMap(): ReactNode {
  return (
    <ReactFlowProvider>
      <WeaponsMapFlow />
    </ReactFlowProvider>
  )
}
