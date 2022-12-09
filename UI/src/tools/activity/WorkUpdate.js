import React, {useContext, useCallback, useState, useEffect} from 'react'
import EditableComponent from '../../components/EditableComponent'
import NodeContext from '../../utils/NodeContext';
import WorkflowContext from '../../utils/WorkflowContext';
import ExecutionContext from '../../utils/ExecutionContext';
import {
    Box,
    Stack,
    Heading,
    Avatar,
    AvatarGroup,
    Text,
    Checkbox,
    useToast
} from '@chakra-ui/react'
import Assignee from './Assignee';
import { AuthProvider } from '../../utils/AuthProvider';
import UserContext from '../../utils/UserContext';
import DurationEdit from './DurationEdit';
import Timer from '../../components/Timer';

function WorkUpdate({onChange, work, addAssigneeInNode}) {


    const {user} = useContext(UserContext)
    const {execution} = useContext(ExecutionContext)
    const toast = useToast()

    const [notifiers, SetNotifiers] = useState(new Map())
    const addNotifiersInMap = (key, value) => {
        SetNotifiers(new Map(notifiers.set(key, value)))
    }

    const [assignees, SetAssignees] = useState(new Map())
    const addAssigneesInMap = (key, value) => {
        SetAssignees(new Map(assignees.set(key, value)))
    }

    useEffect(() => {

        for(let i = 0; i < work.assignee.length; ++i)
        {
            addAssigneesInMap(work.assignee[i].id, work.assignee[i])
        }

        for(let i = 0; i < work.notifiers.length; ++i)
        {
            addNotifiersInMap(work.notifiers[i], work.notifiers[i])
        }
        
    }, [])

    const addAssignee = useCallback((role) => {
        
        if(!assignees.has(role.id))
        {
            addAssigneesInMap(role.id, role)
            updateAssignee()
        }

    }, [assignees]);

    const updateAssignee = useCallback(async () => {

        let ass = Array.from(assignees.values());
        // let notoif = [];
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        let workObj = work;
        

        for(let i = 0; i < ass.length; ++i)
        {
            // ass.push(assignees[i]);
            await authProvider.authGet(`/account/user/?groups=${ass[i][1].id}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);

                if (!notifiers.has(user.data.id)) {
                    addNotifiersInMap(user.data.id, user.data.id)
                    workObj.notifiers.push(user.data.id)
                    // notoif.push([user.data.id, user.data.id]);
                }
                for (let j = 0; j < res.data.length; ++j) 
                {
                    if (!notifiers.has(res.data[j].id)) {
                        addNotifiersInMap(res.data[j].id, res.data[j].id);
                        workObj.notifiers.push(res.data[j].id)
                        // notoif.push([res.data[j].id, res.data[j].id]);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
        }

        workObj.assignee = [...ass]
        onChange(workObj);
        addAssigneeInNode(workObj.assignee)

    }, [])

    const updateWorkTitle = useCallback((name) => {

        let workObj = work;
        workObj.tittle = name;
        onChange(workObj);        
        
    }, []);

    const updateDescription = useCallback((notes) => {

        let workObj = work;
        workObj.notes = notes;
        onChange(workObj);
        
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
        authProvider.authPatch(`/activity/execution/work/handle/${work.id}/`, finished, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            onChange(res.data)
            toast({
                position: 'top',
                title: `Approved`,
                description: `${work.title} is marked complete`,
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
        })
        .catch(error => {
            console.log(error);
        })
    }
    
    return (
        <>
            <Box p={6}>
                <Stack spacing={0} align={'center'} mb={5}>
                    <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                        {execution === null? <EditableComponent color={'gray.500'} defaultValue={work.title} updateTitle={updateWorkTitle}/>:<Text>{work.title}</Text>}
                    </Heading>
                    {execution === null?<EditableComponent color={'gray.500'} defaultValue={work.notes} updateTitle={updateDescription}/>:<Text>{work.notes}</Text>}
                    {execution === null?<Assignee addAssigneeInWork={addAssignee}/>: <></>}
                    {execution === null?<></>:<Checkbox isChecked={work.has_finished === 'true' || work.has_finished === true} size='sm' colorScheme='green' borderColor='red.400' onChange={(e)=>{sendSelection(e, work)}}>Mark complete</Checkbox>}
                </Stack>
                {execution === null?<DurationEdit onChange={onChange} work={work}/>: <Timer deadline={new Date(work.completion_date)}/>}
                <AvatarGroup size='md'>
                {
                    assignees.size === 0 ? <></>: [...assignees].map((assignee, idx) => {
                    return(
                        <Avatar key={idx} name={(assignee[1].name).split('_')[0]} src={assignee[1].image} />
                    )
                    })
                }
                </AvatarGroup>
            </Box>
        </>
    )
}

export default WorkUpdate