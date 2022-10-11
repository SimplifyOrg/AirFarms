import React, { useState, useRef, useCallback, useMemo, useContext, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MarkerType
} from 'react-flow-renderer';
import Sidebar from './Sidebar';
import './css/workflow.css'
// import '../../../node_modules/react-flow-renderer/dist/style.css'
import WorkflowNode from './WorkflowNode';
import ButtonEdge from './ButtonEdge'
import UserContext from '../../utils/UserContext';
import WorkflowContext from '../../utils/WorkflowContext';
// import FarmContext from '../../utils/FarmContext';
import NodeContext from '../../utils/NodeContext';

function WorkflowDiagram() {
    
    const {user} = useContext(UserContext)
    // const {farm} = useContext(FarmContext)
    const {node, setNode} = useContext(NodeContext)
    const {workflow, setWorkflow} = useContext(WorkflowContext)
    const nodeTypes = useMemo(() => ({ workflowNode: WorkflowNode }), []);
    const edgeTypes = useMemo(() => ({ buttonedge: ButtonEdge }), []);
    
    const initialNodes = [
        {
            id: 'n1',
            type: 'workflowNode',
            data: { 
                label: 'start',
                title: 'start',
                notifiers: [user.id],
                notes: "",
                works: []
            },
            position: { x: 50, y: 5 },
        },
        {
            id: 'n2',
            type: 'workflowNode',
            data: { 
                label: 'end',
                title: 'end',
                notifiers: [user.id],
                notes: "",
                works: []
            },
            position: { x: 250, y: 5 },
        },
      ];

    const initialEdges = [
        {
            id: '1',
            source: 'n1',
            target: 'n2',
            type: 'buttonedge',
            sourceHandle: "a",
            animated: true,
            data: { 
                label:'Approval', 
                text: 'New transition',
                transition: 
				{
					id: "1",
					previous: "n1",
					next: "n2",
					associatedFlow: "1",
					need_approval: false,
					transitionapprovals: []
				}
            }
        },
    ];
    
    const reactFlowStyle = {
        background: '#f8f8ff',
    };

    const defaultEdgeOptions = { animated: true };

    let id = 0;
    const getId = () => `dndnode_${id++}`;
    let edgeid = 2;
    const getEdgeId = () => `dndedge_${edgeid++}`;

    const proOptions = { hideAttribution: true };

    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = useCallback((params) => {

        let edgeParams = {
            ...params,
            id: getEdgeId(),
            type: 'buttonedge',
            sourceHandle: "a",
            data: {
                label:'Approval', 
                text: 'New transition',
                transition: 
                {
                    id: "1",
                    previous: params.source,
                    next: params.target,
                    associatedFlow: "1",
                    need_approval: false,
                    transitionapprovals: []
                }
            }
        }
        let copyEdgeParams = edgeParams
        setEdges((eds) => addEdge(edgeParams, eds))
        addEdgeLocal(copyEdgeParams)
    }, [workflow]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }, []);
    
    const addNode = (nodeObj) => {

        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(workflow);

        // Add new node to the workflow
        if(nodeObj != null)
        {
            currWorkflow.nodes.push(nodeObj)
            setWorkflow(JSON.stringify(currWorkflow))
        }
    }

    const addEdgeLocal = (edgeObj) => {

        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(workflow);

        // Add new node to the workflow
        if(edgeObj != null)
        {
            currWorkflow.edges.push(edgeObj)
            setWorkflow(JSON.stringify(currWorkflow))
        }
    }

    const onSelectionChange = useCallback(
        (node) => {
            // let currNode = event.node;
            if(node.nodes?.length === 1)
            {
                setNode(node.nodes[0])
            }            
        }, []
    );

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
            return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const nodeId = getId()
            const newNode = {
                id: nodeId,
                type: 'workflowNode',
                position,
                data: { 
                    label: `${type} node`,
                    title: `${type} node`,
                    notifiers: [user.data.id],
                    notes: "",
                    works: []
                },
            };
            addNode(newNode)

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

  return (
    <div className="workflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={proOptions}
            fitView
            style={reactFlowStyle}
            defaultEdgeOptions={defaultEdgeOptions}
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  )
}

export default WorkflowDiagram