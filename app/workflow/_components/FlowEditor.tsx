'use client'

import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/Task';
import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import "@xyflow/react/dist/style.css";
import NodeComponent from './nodes/NodeComponent';
import { useCallback, useEffect } from 'react';
import { AppNode } from '@/types/appNode';
import DeletetableEdge from './edges/DeletetableEdge';


const nodeTypes = {
    FlowScrapeNode: NodeComponent,
}

const edgeTypes = {
    default: DeletetableEdge
}

// const snapGrid : [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { setViewport, screenToFlowPosition } = useReactFlow()

    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition)
            if (!flow) return;
            setNodes(flow.nodes || [])
            setEdges(flow.edges || [])
            if(!flow.vieport) return;

            const { x = 0, y = 0, zoom = 1 } = flow.vieport
            setViewport({
                x,
                y,
                zoom
            })
        } catch (error) {
            
        }
    }, [workflow.definition, setNodes, setEdges, setViewport]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }, [])

    const onDrop = useCallback((event: React.DragEvent) => {
        const taskType = event.dataTransfer.getData("application/reactflow")

        if ( typeof taskType === undefined || !taskType) return;

        const positon = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        })

        const newNode = CreateFlowNode(taskType as TaskType, positon)
        setNodes((nds) => nds.concat(newNode))
    }, [])

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge({...connection, animated: true}, eds))
    }, [])

    return (
    <main className='h-ful w-full'>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            // snapToGrid={true}
            // snapGrid={
            //     snapGrid
            // }
            fitViewOptions={fitViewOptions}
            fitView
            onDragOver={onDragOver}
            onDrop={onDrop}
            onConnect={onConnect}
        >
            <Controls position='top-left'fitViewOptions={fitViewOptions} />
            <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
        </ReactFlow>
    </main>
  )
}

export default FlowEditor