import React, {useCallback, useContext, useState, useEffect} from 'react'
import {Handle, Position, useUpdateNodeInternals, useNodes, useReactFlow } from 'react-flow-renderer'
import { 
    Menu,
    MenuItem,
    MenuButton,
    Center,
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
    WrapItem
 } from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons'
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
    const {execution} = useContext(ExecutionContext)
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)
    const {farm} = useContext(FarmContext)
    const {user} = useContext(UserContext)
    const {workflow} = useContext(WorkflowContext)
    const reactFlowInstance = useReactFlow();
    const {saveWorkflow} = useWorflow(farm, user, reactFlowInstance.setNodes, reactFlowInstance.setEdges)
    const [file, SetFile] = useState(null)
    // const {workflow} = useContext(WorkflowContext)

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
    }, [])

    // useEffect(() => {
    //     if(data?.docs?.length !== 0)
    //     {
    //         // for(let i = 0; i < data.docs.length; ++i)
    //         // {
                
    //         // }
    //     }

    //     updateNodeInternals(id)
    // }, [])

    useEffect(() => {
        if(execution !== null && execution?.currentStates !== undefined)
        {
            for(let i = 0; i < execution.currentStates.length; ++i)
            {
                if(id === execution.currentStates[i])
                {
                    SetNodeColor('green.200');
                    break;
                }
                SetNodeColor('blue.200');
            }
            updateNodeInternals(id)
        }
    }, [jsonFlow])

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
            const authProvider = AuthProvider()
            authProvider.authGet(`/activity/work-documents/handle/?associatedWork=${work.id}`, config)
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

    const onFileChange = useCallback((event) => {
     
        // Update the state
        SetFile(event.target.files[0])
        // this.setState({ selectedFile: event.target.files[0] });
       
      }, [])

    const addAssignee = useCallback((roles) => {
        
        for(let i = 0; i < roles.length; ++i)
        {
            addAssigneeInMap(roles[i].id, roles[i])
        }

    }, [assignees]);

    // const onOpen = useCallback(async () => {
        
    //     const currWorkflow = localStorage.getItem(workflow);
    //     const workflowObj = JSON.parse(currWorkflow)

    //     const authProvider = AuthProvider()
    //     let config = {
    //         headers: {
    //             'Accept': 'application/json'
    //         }
    //     }
    //     await authProvider.authGet(`/activity/work-group/handle/?associatedFlow=${workflowObj.workflow.id}&&ordering=-id`, config)
    //     .then(res =>{
    //         console.log(res);
    //         console.log(res.data);
    //         for(let j = 0; j < res.data.length; ++j)
    //         {
    //             addCandidateAssigneeInMap(res.data[j].id, res.data[j])                          
    //         }

    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })

    // }, []);
    
  return (
    <Box bg={nodeColor} display='flex' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Handle type="target" position={Position.Top} />
        {/* <div>
            <label htmlFor="text">Work:</label>
            <input id="work" name="text" onChange={onChange} />
        </div> */}
        <VStack display='flex'>
        <EditableComponent defaultValue={data !== {}? data?.label : 'New Node'} updateTitle={updateTitle}/>
        {workList.size === 0?
        <Popover isLazy>
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
        </Popover> : <></>
        }
        <VStack display='flex' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        {
            workList.size === 0 ? <p></p>: [...workList].map((work, idx) => {
                const workId = (work[1].id).toString().split('_');
                let check = false;
                if(workId[0] !== 'temp')
                {
                    check = true;
                }
                return(
                    <HStack borderColor='blue.400' borderWidth='1px' borderRadius='md' overflow='hidden'>
                        <WorkModal mr={2} onChange={onChange} addAssignee={addAssignee} work={work[1]}/>
                        {check?<Checkbox isChecked={work[1].has_finished === 'true' || work[1].has_finished === true} size='sm' colorScheme='green' borderColor='blue.400' id={idx} onChange={(e)=>{sendSelection(e, work[1])}}></Checkbox>:<Checkbox size='sm' colorScheme='green' iconColor='blue.400' id={idx} isDisabled></Checkbox>}
                    </HStack>
                )
            })
        }
        <HStack>
        { workList.size > 0?
        <Popover align='left'>
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
        </Popover> : <></>
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
        <AvatarGroup size='xs' max={2}>
        {
            assignees.size === 0 ? <></>: [...assignees].map((assignee, idx) => {
            return(
                <Avatar key={idx} name={(assignee[1].name).split('_')[0]} src={assignee[1].image} />
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