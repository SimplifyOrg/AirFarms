import React, { useState, useRef, useCallback, useMemo, useContext, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  isNode,
  isEdge,
  getConnectedEdges
} from 'react-flow-renderer';
import Sidebar from './Sidebar';
import './css/workflow.css'
// import '../../../node_modules/react-flow-renderer/dist/style.css'
import WorkflowNode from './WorkflowNode';
import ButtonEdge from './ButtonEdge'
import UserContext from '../../utils/UserContext';
import WorkflowContext from '../../utils/WorkflowContext';
import FarmContext from '../../utils/FarmContext';
import ExecutionContext from '../../utils/ExecutionContext';
// import FarmContext from '../../utils/FarmContext';
import NodeContext from '../../utils/NodeContext';
import useWorflow from './useWorflow';
import {useColorModeValue, useDisclosure} from '@chakra-ui/react'
import { AuthProvider } from '../../utils/AuthProvider';
import ConfirmationDialog from '../../components/ConfirmationDialog';

function WorkflowDiagram(props) {
    
    const {user} = useContext(UserContext)
    // const {farm} = useContext(FarmContext)
    const {node, setNode} = useContext(NodeContext)
    const {execution} = useContext(ExecutionContext)
    const {workflow} = useContext(WorkflowContext)
    const {farm} = useContext(FarmContext)
    const nodeTypes = useMemo(() => ({ workflowNode: WorkflowNode }), []);
    const edgeTypes = useMemo(() => ({ buttonedge: ButtonEdge }), []);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [confirm, SetConfirm] = useState({open:false, handleOk: null, handleCancel: null, ok: 'Yes', cancel: 'No', title: 'Confirm', body: 'Are you sure?', isOpen: isOpen, onOpen: onOpen, onClose: onClose})
    const [deleteNodes, SetDeleteNodes] = useState([])
    const [deleteEdges, SetDeleteEdges] = useState([])

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
    
    // const reactFlowStyle = {
    //     background: useColorModeValue('white', 'gray.800'),
    // };

    const defaultEdgeOptions = { animated: true };

    // const [id, SetId] = useState(0)
    // const getId = () => {SetId(id+1); return `dndnode_${id}`; }
    // const [edgeid, SetEdgeid] = useState(0)
    // const getEdgeId = () => {SetEdgeid(edgeid+1); return `dndedge_${edgeid}`; }

    const proOptions = { hideAttribution: true };

    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, SetReactFlowInstance] = useState(null)
    const {saveWorkflow} = useWorflow(farm, user, setNodes, setEdges)
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

        if (typeof edgeParams.source === 'string' || edgeParams.source instanceof String)
        {
            if(!(edgeParams.source).includes('dnd') && !(edgeParams.source).includes('n1'))
            {
                edgeParams.source = parseInt(edgeParams.source)
                edgeParams.data.transition.previous = parseInt(edgeParams.source)
            }
        }
        if (typeof edgeParams.target === 'string' || edgeParams.target instanceof String)
        {
            if(!(edgeParams.target).includes('dnd') && !(edgeParams.target).includes('n1'))
            {
                edgeParams.target = parseInt(edgeParams.target)
                edgeParams.data.transition.next = parseInt(edgeParams.target)
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
            saveWorkflow();
        }
    }

    const onSelectionChange = useCallback(
        (node) => {
            // let currNode = event.node;
            if(node.nodes?.length === 1)
            {
                setNode(node.nodes[0])
            }

            if(node.nodes.length > 0)
            {
                SetDeleteNodes(node.nodes)
            }
        }, []
    );

    // useEffect(() => {
    //     setNodes((nds) =>
    //       nds.map((node) => {
    //         if (node.id === '1') {
    //           // it's important that you create a new object here
    //           // in order to notify react flow about the change
    //           node.data = {
    //             ...node.data,
    //             label: 'nodeName',
    //           };
    //         }
    
    //         return node;
    //       })
    //     );
    //   }, [setNodes]);

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

    const onConnectStart = useCallback((_, { nodeId }) => {
        connectingNodeId.current = nodeId;
    }, []);

    const onConnectEnd = useCallback(
        (event) => {
          const targetIsPane = event.target.classList.contains('react-flow__pane');
    
          if (targetIsPane) {
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            // const type = event.dataTransfer.getData('application/reactflow');

            // // check if the dropped element is valid
            // if (typeof type === 'undefined' || !type) {
            //     return;
            // }

            // const position = reactFlowInstance.project({
            //     x: event.clientX - reactFlowBounds.left,
            //     y: event.clientY - reactFlowBounds.top,
            // });
            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            }
            // const nodeId = getId()
            let currWorkflow = JSON.parse(localStorage.getItem(workflow));
            const nodeId = `dndnode_${currWorkflow.nodes.length}`
            const newNode = {
                id: nodeId,
                type: 'workflowNode',
                position,
                data: { 
                    label: `New node`,
                    title: `New node`,
                    notifiers: [user.data.id],
                    notes: "",
                    works: []
                },
            };
            addNode(newNode)

            setNodes((nds) => nds.concat(newNode));
            onConnect({animated: true, source: connectingNodeId.current, sourceHandle: 'a', target: nodeId, targetHandle: null})
            // setEdges((eds) => eds.concat({ source: connectingNodeId.current, target: nodeId }));
            // we need to remove the wrapper bounds, in order to get the correct position
            // const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
            // const id = getId();
            // const newNode = {
            //   id,
            //   // we are removing the half of the node width (75) to center the new node
            //   position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
            //   data: { label: `Node ${id}` },
            // };
    
            // setNodes((nds) => nds.concat(newNode));
            // setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id }));
          }
        },
        []
    );

    
    // const removeWorkFromDB = (works) => {
    //     let config = {
    //         headers: {
    //             'Accept': 'application/json'
    //         }
    //     }
    //     const authProvider = AuthProvider()
        
    //     works.forEach(element => {

    //         authProvider.authDelete(`/activity/work/handle/${element.id}/`, config)
    //         .then(res => {
                
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
            
    //     });
    // }
    
    const removeNodefromDB = (node) => {

        // removeWorkFromDB(node.data.works)
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        authProvider.authDelete(`/activity/state/handle/${node.id}/`, config)
        .then(res => {
                      
        })
        .catch(error => {
            console.log(error);
        })
    }

    const removeEdgefromDB = (edge) => {
        // removeTransitionApprovalsFromDB(node.data.works)
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        authProvider.authDelete(`/activity/transition/handle/${edge.id}/`, config)
        .then(res => {
                      
        })
        .catch(error => {
            console.log(error);
        })
    }
    
    const removeNode = async (node) => {
        
        let currWorkflow = JSON.parse(localStorage.getItem(workflow));

        for( let i = 0; i < currWorkflow.nodes.length; ++i)
        {
            if ( currWorkflow.nodes[i].id === node.id)
            {
                currWorkflow.nodes.splice(i, 1);
                removeNodefromDB(node);
                localStorage.setItem(workflow, JSON.stringify(currWorkflow));
                saveWorkflow();
                break;
            }        
        }    
    }

    const removeEdge = async (edge) => {
        
        let currWorkflow = JSON.parse(localStorage.getItem(workflow));

        for( let i = 0; i < currWorkflow.edges.length; ++i)
        {     
            if ( currWorkflow.edges[i].id === edge.id) 
            {         
                currWorkflow.edges.splice(i, 1);
                removeEdgefromDB(edge);
                localStorage.setItem(workflow, JSON.stringify(currWorkflow));
                saveWorkflow();
                break;
            }        
        }
    }

    const initiateNodeDelete = useCallback ((nodes) => {
        if(execution === null)
        {
            nodes.forEach(element => {
                if(isNode(element))
                {
                    removeNode(element)
                }
            });
        }        
    }, [])

    const handleCancel = useCallback (async () => {
        saveWorkflow();
        SetDeleteNodes([])
        SetDeleteEdges([])
        localStorage.setItem('deleteNodes', JSON.stringify({'nodes': []}));
        localStorage.setItem('deleteEdges', JSON.stringify({'edges': []}));
        // Close confirmation dialog
        SetConfirm({open:confirm.open, handleOk: confirm.handleOk, handleCancel:confirm.handleCancel, ok: confirm.ok, cancel: confirm.cancel, title: confirm.title, body: confirm.body, isOpen: false, onOpen: confirm.onOpen, onClose: confirm.onClose})
    }, [])

    const handleOk = useCallback ( async () => {

        if((deleteNodes.length > 0 && isNode(deleteNodes[0]))||(node !== null && isNode(node)))
        {
            let currWorkflow = JSON.parse(localStorage.getItem(workflow));
            const connectedEdges = getConnectedEdges(deleteNodes, currWorkflow.edges)
            initiateNodeDelete(deleteNodes);
            initiateEdgeDelete(connectedEdges);
        }
        else
        {
            let nodesJson = JSON.parse(localStorage.getItem('deleteNodes'));
            const nodes = nodesJson.nodes;
            if(nodes.length > 0 && isNode(nodes[0]))
            {
                let currWorkflow = JSON.parse(localStorage.getItem(workflow));
                const connectedEdges = getConnectedEdges(nodes, currWorkflow.edges)
                initiateNodeDelete(nodes);
                initiateEdgeDelete(connectedEdges);
            }
        }

        // Close confirmation dialog
        SetConfirm({open:confirm.open, handleOk: confirm.handleOk, handleCancel:confirm.handleCancel, ok: confirm.ok, cancel: confirm.cancel, title: confirm.title, body: confirm.body, isOpen: false, onOpen: confirm.onOpen, onClose: confirm.onClose})
        
    }, [])
    
    const onWorkNodeDelete = useCallback( async(nodes) => {     
        if(execution === null)
        {
            if(!confirm.isOpen)
            {   
                // Open confirmation dialog
                SetConfirm({open:true, handleOk:handleOk, handleCancel:handleCancel, ok: 'Yes', cancel: 'No', title: 'Confirm', body: `Are you sure, you want to delete ${nodes.length} nodes?`, isOpen: true, onOpen: onOpen, onClose: onClose})
                SetDeleteNodes(nodes)
                localStorage.setItem('deleteNodes', JSON.stringify({'nodes': nodes}));
            }
        }
        else
        {
            handleCancel()
        }        
    },[])

    const initiateEdgeDelete = useCallback ((edges) => {
        if(execution === null)
        {
            edges.forEach(element => {
                if(isEdge(element))
                {
                    removeEdge(element)
                }
            });
        }        
    }, [])

    const onButtonEdgeDelete = useCallback(async (edges) => {
        if(execution === null)
        {
            if(!confirm.isOpen)
            {
                // Open confirmation dialog
                SetConfirm({open:true, handleOk:handleOk, handleCancel:handleCancel, ok: 'Yes', cancel: 'No', title: 'Confirm', body: `Are you sure, you want to delete ${edges.length} edges?`, isOpen: true, onOpen: onOpen, onClose: onClose})
                SetDeleteEdges(edges)
                localStorage.setItem('deleteEdges', JSON.stringify({'edges': edges}));
            }           
        }
        else
        {
            handleCancel()
        }
        
    },[])
    
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
            let del = execution === null? true: false
            // const nodeId = getId()
            let currWorkflow = JSON.parse(localStorage.getItem(workflow));
            const nodeId = `dndnode_${currWorkflow.nodes.length}`
            const newNode = {
                id: nodeId,
                type: 'workflowNode',
                position,
                deletable: del,
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
        <ConfirmationDialog handleOk={handleOk} handleCancel={handleCancel} ok={confirm.ok} cancel={confirm.cancel} title={confirm.title} data={confirm.data} body={confirm.body} isOpen={confirm.isOpen} onOpen={confirm.onOpen} onClose={confirm.onClose}/>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={onWorkNodeDelete}
            onEdgesDelete={onButtonEdgeDelete}
            onConnect={onConnect}
            nodesConnectable={execution === null? true : false}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onInit={SetReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={proOptions}
            fitView
            // style={reactFlowStyle}
            defaultEdgeOptions={defaultEdgeOptions}
          >
            <Controls showInteractive={execution === null? true : false}/>
            <Background color={useColorModeValue('white', 'gray.800')} variant="lines" gap={6} size={1} />
          </ReactFlow>
        </div>
        <Sidebar saveWorkflow={saveWorkflow}/>
      </ReactFlowProvider>
    </div>
  )
}

export default WorkflowDiagram