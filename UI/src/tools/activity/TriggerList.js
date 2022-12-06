import { 
    HStack,
    Popover,
    PopoverTrigger,
    Button,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    Wrap,
    WrapItem,
    IconButton,
    Tooltip
 } from '@chakra-ui/react'
import React, {useCallback} from 'react'
import AddActivityTrigger from './AddActivityTrigger'
import { IoGitBranchOutline, IoGitCommitOutline } from "react-icons/io5";
import {useNavigate} from 'react-router-dom'
import WorkflowContext from '../../utils/WorkflowContext';
import JsonFlowContext from '../../utils/JsonFlowContext';
import ExecutionContext from '../../utils/ExecutionContext';
import { useContext } from 'react';
import { AuthProvider } from '../../utils/AuthProvider';

function TriggerList({triggers, node, onNewTrigger}) {

    const navigate = useNavigate()
    const {workflow} = useContext(WorkflowContext)
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)
    const {execution} = useContext(ExecutionContext)

    const handleClick = useCallback((trigger) => {
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        authProvider.authGet(`/activity/json-workflow/handle/?workflow=${trigger.workflowToTrigger.id}`, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            if(res.data.length > 0)
            {
                localStorage.setItem(workflow, res.data[0].jsonFlow);
                setJsonFlow(res.data[0])
                navigate('/workflow', {
                    state: {
                    workflow: JSON.parse(res.data[0].jsonFlow),
                    }
                })
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, []);

    return (
        <HStack>
            {execution === null? <Tooltip label='Add workflow to trigger on completion'><Popover isLazy>
                <PopoverTrigger>
                    <Button variant='ghost'><IoGitBranchOutline/></Button>
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>Add activity to trigger</PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                            <AddActivityTrigger node={node} onNewTrigger={onNewTrigger} />
                        </PopoverBody>
                    </PopoverContent>
                </Portal>
            </Popover></Tooltip>:<></>}
            
            <Wrap borderWidth="1px" borderRadius="lg">
            {
                triggers === undefined || triggers.length === 0? <p></p>: triggers.map((trigger, idx) => {                    
                    return(
                        <WrapItem>
                            <Tooltip label={trigger.workflowToTrigger.title} aria-label={trigger.workflowToTrigger.title}>
                                <IconButton variant='ghost' aria-label={trigger.workflowToTrigger.title} onClick={() => handleClick(trigger)} icon={<IoGitCommitOutline/>} />
                            </Tooltip>
                        </WrapItem>
                    )
                })
            }
            </Wrap>
        </HStack>
    )
}

export default TriggerList