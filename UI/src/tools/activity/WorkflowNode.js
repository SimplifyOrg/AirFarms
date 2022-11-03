import React, {useCallback, useContext, useState, useEffect} from 'react'
import {Handle, Position, useUpdateNodeInternals, useNodes, useReactFlow } from 'react-flow-renderer'
import { 
    Accordion,
    AccordionItem, 
    AccordionPanel, 
    AccordionButton, 
    Box,
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
    VStack,
    HStack,
    Checkbox,
    Text
 } from '@chakra-ui/react';
import { MinusIcon, AddIcon, ArrowRightIcon } from '@chakra-ui/icons'
import Work from './Work';
import NodeContext from '../../utils/NodeContext';
import FarmContext from '../../utils/FarmContext';
import UserContext from '../../utils/UserContext';
import { AuthProvider } from '../../utils/AuthProvider';
import WorkflowContext from '../../utils/WorkflowContext';
import JsonFlowContext from '../../utils/JsonFlowContext'
import EditableComponent from '../../components/EditableComponent';
import useWorflow from './useWorflow';

const handleStyle = { left: 10 };

function WorkflowNode({id, data}) {

    let initialMembers = []
    let workSet = new Set()
    let initialWorks = []
    const [workList, SetWorkList] = useState(initialWorks)
    const [members, SetMembers] = useState([])
    const [nodeColor, SetNodeColor] = useState('blue.200')
    const updateNodeInternals = useUpdateNodeInternals();


    let initialAssignee = []
    let assigneeSet = new Set()
    const [assignees, SetAssignees] = useState(initialAssignee)
    const nodes = useNodes();
    
    const {node} = useContext(NodeContext)
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)
    const {farm} = useContext(FarmContext)
    const {user} = useContext(UserContext)
    const {workflow} = useContext(WorkflowContext)
    const reactFlowInstance = useReactFlow();
    const {saveWorkflow} = useWorflow(farm, user, reactFlowInstance.setNodes, reactFlowInstance.setEdges)
    // const {workflow} = useContext(WorkflowContext)

    useEffect(() => {
        if(data?.works?.length !== 0)
        {
            for(let i = 0; i < data.works.length; ++i)
            {
                onChange(data.works[i])
                const listAssignees = []
                for(let j = 0; j < data.works[i].assignee.length; ++j)
                {
                    listAssignees.push(data.works[i].assignee[j])
                }
                loadAssignee(listAssignees)
            }
        }

        updateNodeInternals(id)
    }, [])

    useEffect(() => {

        const workflowObj = JSON.parse(localStorage.getItem(workflow))
        for(let i = 0; i < workflowObj.workflow.currentStates.length; ++i)
        {
            if(id === workflowObj.workflow.currentStates[i])
            {
                SetNodeColor('green.200');
                break;
            }
            SetNodeColor('blue.200');
        }
        updateNodeInternals(id)
    }, [jsonFlow])

    const loadAssignee = (users) => {
        let localAssigneeSet = new Set()
        for(let i = 0; i < users.length; ++i)
        {
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }
            const authProvider = AuthProvider()
            authProvider.authGet(`/account/user/?id=${users[i]}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                // TODO: Set work assignees here
                // Might need to get the profile 
                // picture  for the user link
                authProvider.authGet(`/account/profilepicture/?user=${res.data[0].id}`, config)
                .then(resPic => {
                    console.log(resPic);
                    console.log(resPic.data);
                    const data = {
                        assignee: res.data[0],
                        picture: resPic.data[0].image
                    }
                    localAssigneeSet.add(data)
                    addAssignee(Array.from(localAssigneeSet))
                    updateNodeInternals(id)
                })
                .catch(errorPic => {
                    console.log(errorPic);
                    console.log(errorPic.data);
                })
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })
        }
    }

    // const patchWorkflow = (workflowObj) => {
    //     const authProvider = AuthProvider()
    //     const JSONdata = {
    //         jsonFlow: JSON.stringify(workflowObj),
    //         workflow: workflowObj.workflow.id,
    //         farm: farm.id
    //     }
    //     let config = {
    //         headers: {
    //             'Accept': 'application/json'
    //         }
    //     }
    //     authProvider.authGet(`/activity/json-workflow/handle/?workflow=${workflowObj.workflow.id}`, config)
    //     .then(res =>{
    //         console.log(res);
    //         console.log(res.data);
    //         if(res.data.length !== 0)
    //         {
    //             authProvider.authPut(`/activity/json-workflow/handle/${res.data[0].id}/`, JSONdata, config)
    //             .then(resJSON =>{
    //                 console.log(resJSON);
    //                 console.log(resJSON.data);
    //                 // set workflow context with updated workflow object with database ids
    //                 // setWorkflow(resJSON.data.jsonFlow)
    //                 localStorage.setItem(workflow, resJSON.data.jsonFlow);
    //                 setJsonFlow(resJSON.data)
    //             })
    //             .catch(errorJSON => {
    //                 console.log(errorJSON);
    //                 console.log(errorJSON.data);
    //             })
    //         }
    //         else
    //         {
    //             // setWorkflow(JSON.stringify(workflowObj))
    //             localStorage.setItem(workflow, JSON.stringify(workflowObj));
    //             setJsonFlow(JSONdata)
    //         }
    //         // set workflow context with updated workflow object with database ids
    //         // setWorkflow(resJSON.data.jsonFlow)
    //     })
    //     .catch(error => {
    //         // setWorkflow(JSON.stringify(workflowObj))
    //         localStorage.setItem(workflow, JSON.stringify(workflowObj));
    //         setJsonFlow(JSONdata)
    //         console.log(error);
    //         console.log(error.data);
    //     }) 
    // }

    const updateWork = (work) => {
        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(localStorage.getItem(workflow));
        let nodeIndex = -1;

        // Iterate over all nodes and find the node
        // to add the new work
        for(let i = 0; i < currWorkflow.nodes.length; ++i)
        {
            if(currWorkflow.nodes[i].id == id)
            {
                nodeIndex = i
                break;
            }
        }

        // Update work at the node index retrived 
        // from above loop.
        if(nodeIndex != -1)
        {
            for(let i = 0; i < currWorkflow.nodes[nodeIndex].data.works.length; ++i)
            {
                if(currWorkflow.nodes[nodeIndex].data.works[i].id === work.id)
                {
                    currWorkflow.nodes[nodeIndex].data.works[i] = work;
                    // setWorkflow(JSON.stringify(workflowObj))
                    localStorage.setItem(workflow, JSON.stringify(currWorkflow));
                    saveWorkflow();
                    // patchWorkflow(currWorkflow)
                    break;
                }
            }
        }
    }

    const onChange = useCallback((work) => {
        if(!workSet.has(work.id))
        {
            // Add new work item
            workSet.add(work.id)
            initialWorks.push(work)
            SetWorkList(initialWorks.slice())
        }
        else
        {
            // Update existing work item
            updateWork(work)
        }
    }, []);

    // Mark work as complete
    // Send direct request to database
    const sendSelection = (e, work) => {
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        work.has_finished = e.target.checked
        const finished = {
            has_finished: e.target.checked
        }
        authProvider.authPatch(`/activity/work/handle/${work.id}/`, finished, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            onChange(work)
            //TODO: show banner
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })
    }

    const updateTitle = useCallback((title) => {
        
        if(data !== {})
        {
            data.label = title
            data.title = title

            // Get current workflow's JSON object
            let currWorkflow = JSON.parse(localStorage.getItem(workflow));

            // Iterate over all nodes and find the node
            // to update the title
            for(let i = 0; i < currWorkflow.nodes.length; ++i)
            {
                if(currWorkflow.nodes[i].id == id)
                {
                    currWorkflow.nodes[i].data.label = title
                    currWorkflow.nodes[i].data.title = title
                    const JSONdata = {
                        jsonFlow: JSON.stringify(currWorkflow),
                        workflow: currWorkflow.workflow.id,
                        farm: farm.id
                    }
                    // setWorkflow(JSON.stringify(currWorkflow))
                    localStorage.setItem(workflow, JSON.stringify(currWorkflow));
                    saveWorkflow();
                    setJsonFlow(JSONdata)
                    updateNodeInternals(id)
                    // patchWorkflow(currWorkflow)
                    break;
                }
            }            
        }

    }, []);

    const addAssignee = useCallback((users) => {
        
        for(let i = 0; i < users.length; ++i)
        {
            if(!assigneeSet.has(users[i].assignee.id))
            {
                assigneeSet.add(users[i].assignee.id)
                initialAssignee.push(users[i])
            }
        }
        SetAssignees(initialAssignee.slice())

    }, [assignees]);
    
  return (
    <Box bg={nodeColor} display='flex' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Handle type="target" position={Position.Top} />
        {/* <div>
            <label htmlFor="text">Work:</label>
            <input id="work" name="text" onChange={onChange} />
        </div> */}
        <VStack display='flex'>
        <Accordion>
            <AccordionItem>
                {({ isExpanded }) => (
                <>
                    <h5>
                    <AccordionButton>
                        <EditableComponent defaultValue={data !== {}? data?.label : 'New Node'} updateTitle={updateTitle}/>
                        {isExpanded ? (
                        <MinusIcon fontSize='12px' />
                        ) : (
                        <AddIcon fontSize='12px' />
                        )}
                    </AccordionButton>
                    </h5>
                    <AccordionPanel pb={4}>
                        <Popover>
                            <PopoverTrigger>
                                <Button>Add work</Button>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverHeader>New Work</PopoverHeader>
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <Work onChange={onChange} addAssignee={addAssignee}/>
                                    </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                    </AccordionPanel>
                </>
                )}
            </AccordionItem>
        </Accordion>
        <VStack display='flex' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        {
            workList.length === 0 ? <p></p>: workList.map((work, idx) => {
                const workId = (work.id).toString().split('_');
                let check = false;
                if(workId[0] !== 'temp')
                {
                    check = true;
                }
                return(
                    <HStack align='center' borderColor='blue.400' borderWidth='1px' borderRadius='md' overflow='hidden'>
                        <Text key={idx} >{work.notes}</Text>
                        {check?<Checkbox isChecked={work.has_finished === 'true' || work.has_finished === true} size='sm' colorScheme='green' borderColor='blue.400' id={idx} onChange={(e)=>{sendSelection(e, work)}}></Checkbox>:<Checkbox size='sm' colorScheme='green' iconColor='blue.400' id={idx} isDisabled></Checkbox>}
                    </HStack>
                )
            })
        }
        </VStack>
        <AvatarGroup size='xs' max={2}>
            {
                assignees.length === 0 ? <></>: assignees.map((assignee, idx) => {
                return(
                    <Avatar key={idx} name={assignee.assignee.first_name+' '+assignee.assignee.last_name} src={assignee.picture} />
                )
                })
            }
        </AvatarGroup>
        </VStack>
        <Handle type="source" position={Position.Bottom} id="a" />
    </Box>
  )
}

export default WorkflowNode