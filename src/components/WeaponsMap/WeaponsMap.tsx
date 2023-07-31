import { useCallback } from 'react'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  MarkerType,
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

const initialNodes = [
  {
    id: '0',
    data: { label: 'rock' },
    position: { x: coords[0][0], y: coords[0][1] },
    style: {
      border: '1px solid red',
    },
  },
  {
    id: '1',
    data: { label: 'paper' },
    position: { x: coords[1][0], y: coords[1][1] },
  },
  {
    id: '2',
    data: { label: 'scissors' },
    position: { x: coords[2][0], y: coords[2][1] },
  },
  {
    id: '3',
    data: { label: 'Spock' },
    position: { x: coords[3][0], y: coords[3][1] },
  },
  {
    id: '4',
    data: { label: 'lizard' },
    position: { x: coords[4][0], y: coords[4][1] },
  },
]

const edgeTypes = {
  floating: FloatingEdge,
}

const initialEdges = [
  {
    id: 'e0-4',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 40,
      height: 40,
      color: 'red',
    },
    source: '0',
    target: '4',
    style: {
      stroke: 'red',
    },
  },
  {
    id: 'e0-2',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 40,
      height: 40,
      color: 'red',
    },
    source: '0',
    target: '2',
    style: {
      stroke: 'red',
    },
  },

  {
    id: 'e1-0',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    source: '1',
    target: '0',
  },
  {
    id: 'e1-3',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    source: '1',
    target: '3',
  },

  {
    id: 'e2-1',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    source: '2',
    target: '1',
  },
  {
    id: 'e2-4',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    source: '2',
    target: '4',
  },

  {
    id: 'e3-0',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    source: '3',
    target: '0',
  },
  {
    id: 'e3-2',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    source: '3',
    target: '2',
  },

  {
    id: 'e4-1',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    source: '4',
    target: '1',
  },
  {
    id: 'e4-3',
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    source: '4',
    target: '3',
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
