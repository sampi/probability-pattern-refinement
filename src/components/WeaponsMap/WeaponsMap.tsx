import { useCallback } from 'react'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  MarkerType,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'

import FloatingEdge from './FloatingEdge.js'
import FloatingConnectionLine from './FloatingConnectionLine.js'

import './WeaponsMap.css'

function generateCoordinates(R, N) {
  let coordinates = []
  for (let i = 0; i < N; i++) {
    let theta = (i / N) * (2 * Math.PI) - Math.PI / 2
    let x = R * Math.cos(theta)
    let y = R * Math.sin(theta)
    coordinates.push([x, y])
  }
  return coordinates
}

const coords = generateCoordinates(250, 5)

const sharedNodeStyle = () => ({
  'border-radius': '50%',
  'aspect-ratio': '1',
  'line-height': '8rem',
})

const initialNodes = [
  {
    id: '0',
    data: { label: 'rock' },
    position: { x: coords[0][0], y: coords[0][1] },
    style: {
      border: '1px solid red',
      ...sharedNodeStyle(),
    },
  },
  {
    id: '1',
    data: { label: 'paper' },
    position: { x: coords[1][0], y: coords[1][1] },
    style: {
      ...sharedNodeStyle(),
    },
  },
  {
    id: '2',
    data: { label: 'scissors' },
    position: { x: coords[2][0], y: coords[2][1] },
    style: {
      ...sharedNodeStyle(),
    },
  },
  {
    id: '3',
    data: { label: 'Spock' },
    position: { x: coords[3][0], y: coords[3][1] },
    style: {
      ...sharedNodeStyle(),
    },
  },
  {
    id: '4',
    data: { label: 'lizard' },
    position: { x: coords[4][0], y: coords[4][1] },
    style: {
      ...sharedNodeStyle(),
    },
  },
]

const edgeTypes = {
  floating: FloatingEdge,
}

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

export function WeaponsMap() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          },
          eds,
        ),
      ),
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
