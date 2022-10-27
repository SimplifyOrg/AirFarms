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

function WorkflowDiagram(props) {
    
    const {user} = useContext(UserContext)
    // const {farm} = useContext(FarmContext)
    const {node, setNode} = useContext(NodeContext)
    const {workflow} = useContext(WorkflowContext)
    const nodeTypes = useMemo(() => ({ workflowNode: WorkflowNode }), []);
    const edgeTypes = useMemo(() => ({ buttonedge: ButtonEdge }), []);
    
    
    const initialNodes = [] //;
    const initialEdges = [] //workflowObj.edges;

    // const initialNodes = [
    //     {
    //         id: 'n1',
    //         type: 'workflowNode',
    //         data: { 
    //             label: 'start',
    //             title: 'start',
    //             notifiers: [user.id],
    //             notes: "",
    //             works: []
    //         },
    //         position: { x: 50, y: 5 },
    //     },
    //     {
    //         id: 'n2',
    //         type: 'workflowNode',
    //         data: { 
    //             label: 'end',
    //             title: 'end',
    //             notifiers: [user.id],
    //             notes: "",
    //             works: []
    //         },
    //         position: { x: 250, y: 5 },
    //     },
    //   ];

    // const initialEdges = [
    //     {
    //         id: '1',
    //         source: 'n1',
    //         target: 'n2',
    //         type: 'buttonedge',
    //         sourceHandle: "a",
    //         animated: true,
    //         data: { 
    //             label:'Approval', 
    //             text: 'New transition',
    //             transition: 
	// 			{
	// 				id: "1",
	// 				previous: "n1",
	// 				next: "n2",
	// 				associatedFlow: "1",
	// 				need_approval: false,
	// 				transitionapprovals: []
	// 			}
    //         }
    //     },
    // ];
    
    const reactFlowStyle = {
        background: '#f8f8ff',
    };

    const defaultEdgeOptions = { animated: true };

    // const [id, SetId] = useState(0)
    // const getId = () => {SetId(id+1); return `dndnode_${id}`; }
    // const [edgeid, SetEdgeid] = useState(0)
    // const getEdgeId = () => {SetEdgeid(edgeid+1); return `dndedge_${edgeid}`; }

    const proOptions = { hideAttribution: true };

    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, SetReactFlowInstance] = useState(null)
    // const { setViewport } = useReactFlow();

    useEffect(() => {
        if(workflow !== undefined)
        {
            const workflowObj = JSON.parse(localStorage.getItem(workflow))
            let init = {
                nodes: [
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
                ],
                edges: []
            }

            setNodes(workflowObj.nodes || init.nodes)
            setEdges(workflowObj.edges || init.edges)
        }
    }, [workflow])

    const onConnect = useCallback((params) => {

        let currWorkflow = JSON.parse(localStorage.getItem(workflow));
        let edgeParams = {
            ...params,
            id: `dndedge_${currWorkflow.edges.length}`,
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
        let currWorkflow = JSON.parse(localStorage.getItem(workflow));

        // Add new node to the workflow
        if(nodeObj != null)
        {
            currWorkflow.nodes.push(nodeObj)
            localStorage.setItem(workflow, JSON.stringify(currWorkflow));
            // setWorkflow(JSON.stringify(currWorkflow))
        }
    }

    const addEdgeLocal = (edgeObj) => {

        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(localStorage.getItem(workflow));

        // Add new node to the workflow
        if(edgeObj != null)
        {
            currWorkflow.edges.push(edgeObj)
            localStorage.setItem(workflow, JSON.stringify(currWorkflow));
            // setWorkflow(JSON.stringify(currWorkflow))
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

    useEffect(() => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === '1') {
              // it's important that you create a new object here
              // in order to notify react flow about the change
              node.data = {
                ...node.data,
                label: 'nodeName',
              };
            }
    
            return node;
          })
        );
      }, [setNodes]);

    const onNodeDragStop = (evt, node) => {
        // on drag stop, we update position
        const nodeColor = node.data.label;
    
        setNodes((nodes) =>
          nodes.map((n) => {
            if (n.id === node.id) {
                n.position = { ...node.position };
                let currWorkflow = JSON.parse(localStorage.getItem(workflow));
                let nodeIndex = -1;

                // Iterate over all nodes and find the node
                // to to update position
                for(let i = 0; i < currWorkflow.nodes.length; ++i)
                {
                    if(currWorkflow.nodes[i].id == n.id)
                    {
                        nodeIndex = i
                        break;
                    }
                }
                if(nodeIndex !== -1)
                {
                    currWorkflow.nodes[nodeIndex].position = { ...node.position };
                    localStorage.setItem(workflow, JSON.stringify(currWorkflow));
                }
                
            }
            return n;
          })
        );

      };

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
            // const nodeId = getId()
            let currWorkflow = JSON.parse(localStorage.getItem(workflow));
            const nodeId = `dndnode_${currWorkflow.nodes.length}`
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
        [reactFlowInstance, workflow]
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
            onInit={SetReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            onNodeDragStop={onNodeDragStop}
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
        <Sidebar patchWorkflow={props.patchWorkflow} setNodes={setNodes} setEdges={setEdges}/>
      </ReactFlowProvider>
    </div>
  )
}

export default WorkflowDiagram