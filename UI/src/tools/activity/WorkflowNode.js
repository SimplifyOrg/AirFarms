import React, {useCallback, useContext, useState, useEffect} from 'react'
import {Handle, Position, useUpdateNodeInternals, useNodes, useReactFlow, getConnectedEdges } from 'react-flow-renderer'
import { 
    Menu,
    MenuItem,
    MenuButton,
    IconButton,
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
    Text,
    Wrap,
    WrapItem,
    useToast,
    Tooltip
 } from '@chakra-ui/react';
import { AttachmentIcon, ArrowRightIcon } from '@chakra-ui/icons'
import Work from './Work';
import NodeContext from '../../utils/NodeContext';
import FarmContext from '../../utils/FarmContext';
import UserContext from '../../utils/UserContext';
import { AuthProvider } from '../../utils/AuthProvider';
import WorkflowContext from '../../utils/WorkflowContext';
import JsonFlowContext from '../../utils/JsonFlowContext';
import ExecutionContext from '../../utils/ExecutionContext';
import EditableComponent from '../../components/EditableComponent';
import useWorflow from './useWorflow';
import WorkModal from './WorkModal';
import Document from './Document';
import DocumentThumbnail from './DocumentThumbnail';
import { BiCommentAdd } from "react-icons/bi";
import TriggerList from './TriggerList';
import Timer from '../../components/Timer';

const handleStyle = { left: 10 };

function WorkflowNode({id, data}) {
    
    const [workList, SetWorkList] = useState(new Map())
    const addWorkInMap = (key, value) => {
        // SetExecutions(prev => new Map([...prev, [key, value]]))
        SetWorkList(new Map(workList.set(key, value)))
        // console.log(executions)
    }

    const [docList, SetDocList] = useState(new Map())
    const addDoc = (key, value) => {
        SetDocList(new Map(docList.set(key, value)))
    }
    const [members, SetMembers] = useState([])
    const [nodeColor, SetNodeColor] = useState('blue.200')
    const updateNodeInternals = useUpdateNodeInternals();

    const [assignees, SetAssignees] = useState(new Map())
    const addAssigneeInMap = (key, value) => {
        SetAssignees(new Map(assignees.set(key, value)))
    }

    const [candidateAssignees, SetCandidateAssignees] = useState(new Map())
    const addCandidateAssigneeInMap = (key, value) => {
        SetCandidateAssignees(new Map(candidateAssignees.set(key, value)))
    }

    const nodes = useNodes();
    
    const {node} = useContext(NodeContext)
    const {execution, setExecution} = useContext(ExecutionContext)
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)
    const {farm} = useContext(FarmContext)
    const {user} = useContext(UserContext)
    const {workflow} = useContext(WorkflowContext)
    const reactFlowInstance = useReactFlow();
    const {saveWorkflow} = useWorflow(farm, user, reactFlowInstance.setNodes, reactFlowInstance.setEdges)
    const [file, SetFile] = useState(null)
    const toast = useToast()

    const [triggers, SetTriggers] = useState(new Map())
    const addTrigger = (key, value) => {
        SetTriggers(new Map(triggers.set(key, value)))
    }

    useEffect(() => {
        if(data?.works?.length !== 0)
        {
            // for(let i = 0; i < data.works.length; ++i)
            if(workList.size === 0 && !workList.has(data.works[0].id))
            {
                addWorkInMap(data.works[0].id, data.works[0])
                // Initalize document list
                initializeDocList(data.works[0])
                const listAssignees = []
                for(let j = 0; j < data.works[0].assignee.length; ++j)
                {
                    listAssignees.push(data.works[0].assignee[j])
                }
                loadAssignee(listAssignees)
            }
        }

        updateNodeInternals(id)
    }, [execution])

    useEffect(() => {
        
        if(!(typeof id === 'string' || id instanceof String))
        {
            const authProvider = AuthProvider()
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }

            authProvider.authGet(`/activity/workflow/trigger/handle/?associatedState=${id}&&ordering=-creationDate`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                for(let i = 0; i < res.data.length; ++i)
                {
                    // addTrigger(res.data[i].id, res.data[i])
                    authProvider.authGet(`/activity/workflow/handle/?id=${res.data[i].workflowToTrigger}`, config)
                    .then(resWorkflow => {
                        console.log(resWorkflow);
                        console.log(resWorkflow.data);
                        for(let i = 0; i < resWorkflow.data.length; ++i)
                        {
                            onNewTrigger(res.data[i], resWorkflow.data[i])
                        }
                    })
                    .catch(errorWorkflow => {
                        console.log(errorWorkflow);
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
        }

        updateNodeInternals(id)
    }, [execution])

    useEffect(() => {
        if(execution !== null && execution?.currentStates !== undefined)
        {
            for(let i = 0; i < execution.currentStates.length; ++i)
            {
                if(id === execution.currentStates[i])
                {
                    SetNodeColor('green.500');
                    break;
                }
                else
                {
                    SetNodeColor('orange.600');
                }                
            }            
        }
        else
        {
            SetNodeColor('orange.600');
        }
        updateNodeInternals(id)
    }, [jsonFlow, execution])


    const initializeDocList = (work) => {

        const workId = (work.id).toString().split('_');
        let check = false;
        if(workId[0] !== 'temp')
        {
            check = true;
        }
        if(work.id !== undefined && check)
        {
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }
            let endPoint = `/activity/work-documents/handle/?associatedWork=${work.id}`
            if(execution !== null)
            {
                endPoint = `/activity/execution/work-documents/handle/?associatedExecutionWork=${work.id}`
            }
            const authProvider = AuthProvider()
            authProvider.authGet(endPoint, config)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                // Update docList state
                for(let i = 0; i < res.data.length; ++i)
                {
                    addDoc(parseInt(res.data[i].id), res.data[i])
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        
    }

    const loadAssignee = (roles) => {
        let localAssigneeSet = new Set()
        for(let i = 0; i < roles.length; ++i)
        {
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }
            const authProvider = AuthProvider()
            // Assignees are actually annotated groups
            // So querying groups instead of people
            authProvider.authGet(`/activity/work-group/handle/?id=${roles[i].id}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                addAssignee(res.data)
                updateNodeInternals(id)
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

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
                    addWorkInMap(work.id, work)                    
                    localStorage.setItem(workflow, JSON.stringify(currWorkflow));
                    saveWorkflow();
                    break;
                }
            }
        }
    }

    const onChange = useCallback((work) => {
        if(workList.size === 0 && !workList.has(work.id))
        {
            // Add new work item
            addWorkInMap(work.id, work)
            saveWorkflow();
        }
        else
        {
            // Update existing work item
            updateWork(work)
        }
    }, []);

    const onNewTrigger = useCallback((trigger, workflow) => {
        let trig = trigger
        trig.workflowToTrigger = workflow
        addTrigger(trigger.id, trig)
        updateNodeInternals(id)
    }, []);

    const updateDocList = useCallback((values, onSubmitProps) => {

        // console.log(values)
        const workArray = [...workList.keys()]
        const workId = (workArray[0]).toString().split('_');
        let check = false;
        if(workId[0] !== 'temp')
        {
            check = true;
        }
        if(workArray[0] !== undefined && check)
        {
            // Create an object of formData
            const formData = new FormData();

            formData.append('title', values.title)
            formData.append('file', values.files[0])
            formData.append('associatedWork', workArray[0])

            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const authProvider = AuthProvider()
            authProvider.authPost(`/activity/work-documents/handle/`, formData, config, false)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                // Update docList
                addDoc(parseInt(res.data.id), res.data)

            })
            .catch(error => {
                console.log(error);
            })
        }
        
    }, []);

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
                    localStorage.setItem(workflow, JSON.stringify(currWorkflow));
                    saveWorkflow();
                    setJsonFlow(JSONdata)
                    updateNodeInternals(id)
                    break;
                }
            }            
        }

    }, []);

    const onFileChange = useCallback((event) => {     
        // Update the state
        SetFile(event.target.files[0])       
      }, [])

    const addAssignee = useCallback((roles) => {
        
        for(let i = 0; i < roles.length; ++i)
        {
            addAssigneeInMap(roles[i].id, roles[i])
        }

    }, [assignees]);


    const updateWorkflowStates = (authProvider, exec, config) => {
        
        authProvider.authPut(`/activity/execution/handle/${exec.id}/`, exec, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            setExecution(res.data)
            toast({
                position: 'top',
                title: `Transition successful`,
                description: ``,
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
            updateNodeInternals(id)
        })
        .catch(error => {
            console.log(error);
        })
    }

    const patchExecution = (exec) => {
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        authProvider.authGet(`/activity/execution/handle/?id=${exec.id}`, config)
        .then(getWorkflow => {
            if(getWorkflow.data.length !== 0)
            {
                // Update workflow states
                updateWorkflowStates(authProvider, exec, config)
            }
        })
        .catch(errorGetWorkflow => {
            console.log(errorGetWorkflow);
        })
    }

    const startWorkflowExecution = (trigger) => {        
        
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        let startState = -1;

        let trig = triggers.get(trigger.id)
        startState = trig.workflowToTrigger.startState;

        if(startState !== -1 && startState !== null)
        {
            let body = {
                associatedFlow: trig.workflowToTrigger.id,
                currentStates: [startState],
                initiater: user.data.id
            }

            authProvider.authPost(`/activity/execution/handle/`, body, config, false)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                // setExecution()
                toast({
                    position: 'top',
                    title: `Activity execution`,
                    description: `Successfuly started execution of activity ${trig.workflowToTrigger.title}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                // onNewExecution(body.associatedFlow, res.data)
            })
            .catch(error => {
                console.log(error);
                toast({
                    position: 'top',
                    title: `Activity execution`,
                    description: `Failed to start execution of activity ${trig.workflowToTrigger.title}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            })
        }
        else
        {
            toast({
                position: 'top',
                title: `Activity execution`,
                description: `Failed to start execution of activity ${trig.workflowToTrigger.title}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const triggerWorkflowExecutions = (currentState) => {
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        authProvider.authGet(`/activity/workflow/trigger/handle/?associatedState=${currentState}`, config)
        .then(getTrigger => {
            startWorkflowExecution(getTrigger.data[0])
        })
        .catch(errorGetWorkflow => {
            console.log(errorGetWorkflow);
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
            for(let j = 0; workflowObj.nodes[i].id === id && j < workflowObj.nodes[i].data.works?.length; ++j)
            {
                if(!workflowObj.nodes[i].data.works[j].has_finished 
                    || workflowObj.nodes[i].data.works[j].is_halted)
                    {
                        move = false;
                        toast({
                            position: 'top',
                            title: `Transition failed!`,
                            description: `Work assigned to the state is incomplete.`,
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                          })
                        break;
                    }
            }
        }

        const connectedEdges = getConnectedEdges([node], workflowObj.edges)

        // TODO: optimize this
        for( let k = 0; k < connectedEdges.length; ++k)
        {
            for(let i = 0; move && i < workflowObj.edges?.length; ++i)
            {
                for(let j = 0; workflowObj.edges[i].id === connectedEdges[k].id && j < workflowObj.edges[i].data?.transition?.transitionapprovals?.length; ++j)
                {
                    if(!workflowObj.edges[i].data?.transition.transitionapprovals[j].approval 
                        || workflowObj.edges[i].data?.transition.transitionapprovals[j].reject)
                        {
                            move = false;
                            toast({
                                position: 'top',
                                title: `Transition failed!`,
                                description: `Work is not approved please connect with the supervisor.`,
                                status: 'error',
                                duration: 3000,
                                isClosable: true,
                            })
                            break;
                        }
                }
            }
        }

        // Way to move state is
        // Add the next state in current states
        // Remove prev state from current state.

        if(move && execution !== null)
        {
            let exec = execution;
            let setTarget = false;
            for(let k = 0; k < exec.currentStates.length; ++k)
            {
                for(let i = 0; i < connectedEdges.length; ++i)
                {
                    if(exec.currentStates[k] === connectedEdges[i].source)
                    {
                        triggerWorkflowExecutions(exec.currentStates[k])
                        if(connectedEdges[i].target !== null || connectedEdges[i].target !== undefined)
                        {
                            exec.currentStates[k] = connectedEdges[i].target;
                            setTarget = true;
                        }                        
                        break;
                    }
                    
                }
            }
            if(!setTarget)
            {
                exec.has_finished = true;
            }
            patchExecution(exec)
        }

    }
    
  return (
    <Box bg={nodeColor} display='flex' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Handle type="target" position={Position.Top} />
        <VStack display='flex'>
        {execution === null?<HStack><EditableComponent defaultValue={data !== {}? data?.label : 'New Node'} updateTitle={updateTitle}/></HStack>:<Text>{data !== {}? data?.label : 'New Node'}</Text>}
        {workList.size === 0 && execution === null?
        <Tooltip label='Add work'><Popover isLazy>
            <PopoverTrigger>
                <Button variant='ghost'><BiCommentAdd/></Button>
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
        </Popover></Tooltip> : <></>
        }
        <VStack overflow='hidden'>
        {
            workList.size === 0 ? <p></p>: [...workList].map((work, idx) => {
                const workId = (work[1].id).toString().split('_');
                let check = false;
                if(workId[0] !== 'temp' && execution !== null)
                {
                    check = true;
                }
                return(
                    <HStack overflow='hidden'>
                        <Tooltip label={work[1].title}><WorkModal mr={2} onChange={onChange} addAssignee={addAssignee} work={work[1]}/></Tooltip>
                    </HStack>
                )
            })
        }
        <HStack>
        { workList.size > 0 && execution === null?
        <Tooltip label='Attach documents'><Popover align='left'>
            <PopoverTrigger>
                <Button variant='ghost' size='xs'><AttachmentIcon/></Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>New document</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Document work={[...workList]} updateDocList={updateDocList} onFileChange={onFileChange}/>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover></Tooltip> : <></>
        }

        <Wrap spacing='3px'>      
        {
            docList.size === 0 || workList.size === 0? <p></p>: [...docList].map((key, value) => {
                
                return(
                    <WrapItem>
                        <DocumentThumbnail doc={key[1]} />
                    </WrapItem>
                )
            })
        }
        </Wrap>
        </HStack>
        
        </VStack>
        {execution === null ||  workList.size === 0? <></> : [...workList].map((work, idx) => {
                if(!work[1].has_finished)
                {
                    return(
                        <Timer deadline={new Date(work[1].completion_date)}/>
                    )
                }
                else
                {
                    return(
                        <></>
                    )
                }
            })
        }
        <TriggerList triggers={Array.from(triggers.values())} node={id} onNewTrigger={onNewTrigger}/>
        <AvatarGroup size='xs' max={2}>
        {
            assignees.size === 0 ? <></>: [...assignees].map((assignee, idx) => {
            return(
                <Avatar key={idx} name={(assignee[1].name).split('_')[0]} src={assignee[1].image} />
            )
            })
        }
        </AvatarGroup>
        {execution !== null && execution.currentStates.includes(id)?<IconButton variant='outline' size='md' onClick={() => moveState()} icon={<ArrowRightIcon/>}/>:<></>}
        </VStack>
        <Handle type="source" position={Position.Bottom} id="a" />
    </Box>
  )
}

export default WorkflowNode