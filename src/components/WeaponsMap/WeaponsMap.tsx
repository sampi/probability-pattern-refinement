import { useCallback } from 'react'
import {
  addEdge,
  Background,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import FloatingConnectionLine from './FloatingConnectionLine'
import FloatingEdge from './FloatingEdge'

import './WeaponsMap.css'

import type { ComponentType, CSSProperties, ReactNode } from 'react'
import type { Edge, EdgeProps, Node, OnConnect, XYPosition } from 'reactflow'

/**
 * Generate `numNodes` equally spaced coordinates along the circumference of a `radius` sized circle
 */
function generateCoordinates(radius: number, numNodes: number): XYPosition[] {
  const coordinates = []
  for (let i = 0; i < numNodes; i++) {
    const theta = (i / numNodes) * (2 * Math.PI) - Math.PI / 2
    const x = radius * Math.cos(theta)
    const y = radius * Math.sin(theta)
    coordinates.push({ x, y })
  }
  return coordinates
}

const coords = generateCoordinates(250, 5)

const sharedNodeStyle = (color?: string): CSSProperties => ({
  borderRadius: '50%',
  aspectRatio: '1',
  lineHeight: '8rem',
  fontSize: '1.25rem',
  overflow: 'hidden',
  textAlign: 'center',
  ...(color != null ? { border: `1px solid ${color}` } : {}),
})

const initialNodes: Node[] = [
  {
    id: '0',
    data: { label: 'rock' },
    position: coords[0],
    style: sharedNodeStyle('red'),
  },
  {
    id: '1',
    data: { label: 'paper' },
    position: coords[1],
    style: sharedNodeStyle(),
  },
  {
    id: '2',
    data: { label: 'scissors' },
    position: coords[2],
    style: sharedNodeStyle(),
  },
  {
    id: '3',
    data: { label: 'Spock' },
    position: coords[3],
    style: {
      ...sharedNodeStyle(),
    },
  },
  {
    id: '4',
    data: { label: 'lizard' },
    position: coords[4],
    style: sharedNodeStyle(),
  },
]

const markerEnd = (color?: string): Edge['markerEnd'] => ({
  type: MarkerType.ArrowClosed,
  width: 40,
  height: 40,
  color,
})
const sharedEdgeStyle = (color?: string): Edge['style'] => ({
  stroke: color,
})

const initialEdges = [
  {
    id: 'e0-4',
    type: 'floating',
    markerEnd: markerEnd('red'),
    source: '0',
    target: '4',
    style: sharedEdgeStyle('red'),
  },
  {
    id: 'e0-2',
    type: 'floating',
    markerEnd: markerEnd('red'),
    source: '0',
    target: '2',
    style: sharedEdgeStyle('red'),
  },

  {
    id: 'e1-0',
    type: 'floating',
    markerEnd: markerEnd(),
    source: '1',
    target: '0',
    style: sharedEdgeStyle(),
  },
  {
    id: 'e1-3',
    type: 'floating',
    markerEnd: markerEnd(),
    source: '1',
    target: '3',
    style: sharedEdgeStyle(),
  },

  {
    id: 'e2-1',
    type: 'floating',
    markerEnd: markerEnd(),
    source: '2',
    target: '1',
    style: sharedEdgeStyle(),
  },
  {
    id: 'e2-4',
    type: 'floating',
    markerEnd: markerEnd(),
    source: '2',
    target: '4',
    style: sharedEdgeStyle(),
  },

  {
    id: 'e3-0',
    type: 'floating',
    markerEnd: markerEnd(),
    source: '3',
    target: '0',
    style: sharedEdgeStyle(),
  },
  {
    id: 'e3-2',
    type: 'floating',
    markerEnd: markerEnd(),
    source: '3',
    target: '2',
    style: sharedEdgeStyle(),
  },

  {
    id: 'e4-1',
    type: 'floating',
    markerEnd: markerEnd(),
    source: '4',
    target: '1',
    style: sharedEdgeStyle(),
  },
  {
    id: 'e4-3',
    type: 'floating',
    markerEnd: markerEnd(),
    source: '4',
    target: '3',
    style: sharedEdgeStyle(),
  },
]

const edgeTypes = {
  floating: FloatingEdge as ComponentType<EdgeProps>,
}

export function WeaponsMap(): ReactNode {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          },
          eds,
        ),
      )
    },
    [setEdges],
  )

  return (
    <ReactFlow
      className="weapons-circle"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      edgeTypes={edgeTypes}
      connectionLineComponent={FloatingConnectionLine}
    >
      <Background />
    </ReactFlow>
  )
}
