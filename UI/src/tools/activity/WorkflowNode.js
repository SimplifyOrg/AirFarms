import React, {useCallback, useContext, useState, useEffect} from 'react'
import {Handle, Position, useUpdateNodeInternals, useNodes, useReactFlow } from 'react-flow-renderer'
import { 
    Menu,
    MenuItem,
    MenuButton,
    MenuList,
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
import JsonFlowContext from '../../utils/JsonFlowContext';
import ExecutionContext from '../../utils/ExecutionContext';
import EditableComponent from '../../components/EditableComponent';
import useWorflow from './useWorflow';
import WorkModal from './WorkModal';
import Document from './Document';

const handleStyle = { left: 10 };

function WorkflowNode({id, data}) {

    let initialMembers = []
    let workSet = new Set()
    let initialWorks = []
    const [workList, SetWorkList] = useState(initialWorks)
    let docSet = new Set()
    let initialDocs = []
    const [docList, SetDocList] = useState(initialDocs)
    const [members, SetMembers] = useState([])
    const [nodeColor, SetNodeColor] = useState('blue.200')
    const updateNodeInternals = useUpdateNodeInternals();


    let initialAssignee = []
    let assigneeSet = new Set()
    const [assignees, SetAssignees] = useState(initialAssignee)
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
            if(workList.length === 0 && !workSet.has(data.works[0].id))
            {
                // onChange(data.works[i])
                workSet.add(data.works[0].id)
                initialWorks.push(data.works[0])
                SetWorkList(initialWorks.slice())
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

    useEffect(() => {
        if(data?.docs?.length !== 0)
        {
            // for(let i = 0; i < data.docs.length; ++i)
            // {
                
            // }
        }

        updateNodeInternals(id)
    }, [])

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
                localAssigneeSet.add(res.data[0])
                addAssignee(Array.from(localAssigneeSet))
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
                    initialWorks = []
                    initialWorks.push(work)
                    if(!workSet.has(work.id))
                    {
                        workSet.add(work.id)
                    }
                    SetWorkList(initialWorks.slice())
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
        if(workList.length === 0 && !workSet.has(work.id))
        {
            // Add new work item
            workSet.add(work.id)
            initialWorks.push(work)
            SetWorkList(initialWorks.slice())
            saveWorkflow();
        }
        else
        {
            // Update existing work item
            updateWork(work)
        }
    }, []);

    const updateDocList = useCallback((values, onSubmitProps) => {

        console.log(values)
        const workId = (workList[0].id).toString().split('_');
        let check = false;
        if(workId[0] !== 'temp')
        {
            check = true;
        }
        if(workList[0].id !== undefined && check)
        {
            const data = {
                title: values.titledoc,
                file: values.document,
                associatedWork: workList[0].id
            }

            // Create an object of formData
            const formData = new FormData();

            formData.append('title', values.name)
            formData.append('file', file)
            formData.append('associatedWork', workList[0].id)

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
                // TODO: Update docList

            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
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
            if(!assigneeSet.has(roles[i].id))
            {
                assigneeSet.add(roles[i].id)
                initialAssignee.push(roles[i])
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
        <EditableComponent defaultValue={data !== {}? data?.label : 'New Node'} updateTitle={updateTitle}/>
        {workList.length === 0?
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
        </Popover> : <></>
        }
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
                    <HStack borderColor='blue.400' borderWidth='1px' borderRadius='md' overflow='hidden'>
                        <WorkModal mr={2} onChange={onChange} addAssignee={addAssignee} work={work}/>
                        {check?<Checkbox isChecked={work.has_finished === 'true' || work.has_finished === true} size='sm' colorScheme='green' borderColor='blue.400' id={idx} onChange={(e)=>{sendSelection(e, work)}}></Checkbox>:<Checkbox size='sm' colorScheme='green' iconColor='blue.400' id={idx} isDisabled></Checkbox>}
                    </HStack>
                )
            })
        }
        { workList.length > 0?
        <Popover>
            <PopoverTrigger>
                <Button>Attach document</Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>New document</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Document work={workList[0].id} updateDocList={updateDocList} onFileChange={onFileChange}/>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover> : <></>
        }
        <AvatarGroup size='xs' max={2}>
        {
            docList.length === 0 || workList.length === 0? <p></p>: docList.map((doc, idx) => {
                
                return(
                    <Avatar key={idx} name={doc.title} />
                )
            })
        }
        </AvatarGroup>
        </VStack>
        <AvatarGroup size='xs' max={2}>
        {
            assignees.length === 0 ? <></>: assignees.map((assignee, idx) => {
            return(
                <Avatar key={idx} name={(assignee.name).split('_')[0]} src={assignee.image} />
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