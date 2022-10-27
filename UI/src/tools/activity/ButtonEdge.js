import React, {useState, useCallback, useEffect, useContext} from 'react';
import { getBezierPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';
import { 
    AvatarGroup,
    Avatar,
    Button,
    Portal,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    IconButton,
    HStack,
 } from '@chakra-ui/react';
import { ChevronDownIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { AuthProvider } from '../../utils/AuthProvider';
import './css/edgeButton.css';
import Transition from './Transition';
import WorkflowContext from '../../utils/WorkflowContext';
import FarmContext from '../../utils/FarmContext';
import JsonFlowContext from '../../utils/JsonFlowContext';

const foreignObjectSize = 70;

// const onEdgeClick = (evt, id) => {
//   evt.stopPropagation();
//   alert(`remove ${id}`);
// };

export default function CustomEdge({
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style = {},
    markerEnd,
  }) {
    const edgePath = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });

    
    // const inputEdge = {
    //     id: id,
    //     source: source,
    //     target: target,
    //     type: 'buttonedge',
    //     sourceHandle: "a",
    //     animated: true,
    //     data: { 
    //         label:'Approval', 
    //         text: 'New transition',
    //         transition: 
    //         {
    //             id: "1",
    //             previous: source,
    //             next: target,
    //             associatedFlow: "1",
    //             need_approval: false,
    //             transitionapprovals: []
    //         }
    //     }
    // }

    const inputEdge = {
        id: id,
        source: source,
        target: target,
        type: 'buttonedge',
        sourceHandle: "a",
        animated: true,
        data: data
    }

    let initialApprovers = []
    let approverUsers = new Set()
    // const [approverusers, SetApproveruser] = useState(new Set())
    const [approvers, SetApprovers] = useState(initialApprovers)
    const [boxColor, SetBoxColor] = useState('green')
    const {workflow} = useContext(WorkflowContext)
    const {farm} = useContext(FarmContext)
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)

    const addApprover = useCallback((user) => {
        
        if(!approverUsers.has(user.approver.id))
        {
            approverUsers.add(user.approver.id)
            initialApprovers.push(user)
            SetApprovers(initialApprovers.slice())
        }
        
        if(boxColor === 'green' && initialApprovers.length !== 0)
        {
            SetBoxColor('red')
        }
    }, [approvers]);

    const updateWorkflowStates = (authProvider, workflowObject, config) => {
        let statedata = {
            currentStates: workflowObject.workflow.currentStates
        }
        authProvider.authPatch(`/activity/workflow/handle/${workflowObject.workflow.id}/`, statedata, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            const jsondata = {
                jsonFlow: JSON.stringify(workflowObject),
                workflow: workflowObject.workflow.id,
                farm: farm.id
            }
            authProvider.authGet(`/activity/json-workflow/handle/?workflow=${workflowObject.workflow.id}`, config)
            .then(resQueryJSON => {
                authProvider.authPatch(`/activity/json-workflow/handle/${resQueryJSON.data[0].id}/`, jsondata, config, false)
                .then(resJSON =>{
                    console.log(resJSON);
                    console.log(resJSON.data);
                    // set workflow context with updated workflow object with database ids
                    // setWorkflow(resJSON.data.jsonFlow)
                    localStorage.setItem(workflow, resJSON.data.jsonFlow)
                    setJsonFlow(resJSON.data)
                })
                .catch(errorJSON => {
                    console.log(errorJSON);
                    console.log(errorJSON.data);
                }) 
            })
            .catch(errorQueryJSON => {
                console.log(errorQueryJSON);
                console.log(errorQueryJSON.data);
            })
            
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })
    }

    const patchWorkflow = (workflowObj) => {
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        authProvider.authGet(`/activity/workflow/handle/?id=${workflowObj.workflow.id}`, config)
        .then(getWorkflow => {
            if(getWorkflow.data.length !== 0)
            {
                // Update workflow states
                updateWorkflowStates(authProvider, workflowObj, config)
            }
        })
        .catch(errorGetWorkflow => {
            console.log(errorGetWorkflow);
            console.log(errorGetWorkflow.data);
        })
    }

    const moveState = () => {
        // Things to check before moving state
        // 1. If all the transition approvals approved
        // 2. If all the mandatory works completed

        // Get workflow JSON object
        let workflowObj = JSON.parse(localStorage.getItem(workflow))

        let move = true;
        // TODO: optimize this
        for(let i = 0; i < workflowObj.nodes?.length; ++i)
        {
            for(let j = 0; workflowObj.nodes[i].id === inputEdge.source && j < workflowObj.nodes[i].data.works?.length; ++j)
            {
                if(!workflowObj.nodes[i].data.works[j].has_finished 
                    || workflowObj.nodes[i].data.works[j].is_halted === 'true')
                    {
                        move = false;
                        // TODO: show information banner
                        break;
                    }
            }
        }

        // TODO: optimize this
        for(let i = 0; move && i < workflowObj.edges?.length; ++i)
        {
            for(let j = 0; workflowObj.edges[i].id === inputEdge.id && j < workflowObj.edges[i].data?.transition?.transitionapprovals?.length; ++j)
            {
                if(!workflowObj.edges[i].data?.transition.transitionapprovals[j].approval 
                    || workflowObj.edges[i].data?.transition.transitionapprovals[j].reject)
                    {
                        move = false;
                        // TODO: show information banner
                        break;
                    }
            }
        }

        // Way to move state is
        // Add the next state in current states
        // Remove prev state from current state.

        if(move)
        {
            for(let k = 0; k < workflowObj.workflow.currentStates; ++k)
            {
                if(workflowObj.workflow.currentStates[k] === data.transition.previous)
                {
                    workflowObj.workflow.currentStates[k] = data.transition.next;
                    patchWorkflow(workflowObj)
                    // setWorkflow(JSON.stringify(workflowObj))
                    localStorage.setItem(workflow, JSON.stringify(workflowObj));
                    break;
                }
            }
        }

    }

    useEffect(() => {
        // console.log(approvers)
        if(approvers.length !== 0)
        {
            SetBoxColor('red')
        }
        else
        {
            SetBoxColor('green')
        }
    }, [approvers])
  
    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={edgeCenterX - foreignObjectSize / 2}
          y={edgeCenterY - foreignObjectSize / 2}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <body>
            <HStack>           
            <Popover>
                <PopoverTrigger>
                    <Button colorScheme={boxColor} size={8} variant='outline'>
                        <AvatarGroup size='xs' max={2}>
                            {
                                approvers.length === 0 ? <ChevronDownIcon size='xs'/>: approvers.map((approver, idx) => {
                                return(
                                    <Avatar key={idx} name={approver.first_name+' '+approver.last_name} src={approver.picture} />
                                )
                                })
                            }
                        </AvatarGroup>
                    </Button>
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>Transition Approval</PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                            <Transition addApprover={addApprover} edge={inputEdge}/>
                        </PopoverBody>
                    </PopoverContent>
                </Portal>
            </Popover>
            <IconButton variant='outline' size='2xs' onClick={() => moveState()} icon={<ArrowRightIcon boxSize={1.5}/>}/>
            </HStack> 
        
          </body>
        </foreignObject>
      </>
    );
  }
  