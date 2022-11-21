import React, {useContext} from 'react'
import {
    Box,
    VStack,
    HStack,
    Text,
    Image,
    useColorModeValue,
    CloseButton
} from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import { AuthProvider } from '../../utils/AuthProvider'
import WorkflowContext from '../../utils/WorkflowContext'
import ExecutionContext from '../../utils/ExecutionContext'

function ExecutionCard(props) {

    const navigate = useNavigate()
    const {workflow, setWorkflow} = useContext(WorkflowContext)
    const {execution, setExecution} = useContext(ExecutionContext)

    
    let date = new Date(props.execution.startTime);
    
    const handleClick = () => {

        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        authProvider.authGet(`/activity/workflow/handle/?id=${props.execution.associatedFlow}&&ordering=title`, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            setExecution(props.execution)
            setWorkflow('generate_new_hash_here')
            navigate('/workflow', {
                state: {
                workflow: props.workflow
                }
            })
        })
        .catch(error => {
            console.log(error);
        })
        
    }

    const abortExecution = () => {

        const archive = {
            has_finished: true,
        }

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        authProvider.authPatch(`/activity/execution/handle/${props.execution.id}/`, archive, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            navigate('/workflow-list')
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })
    }


    return (
        <Box
        maxW={'270px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
        onClick={handleClick}
        borderWidth='1px'>
            <VStack>
                <HStack><Text noOfLines={1}>{date.toLocaleString() }</Text><CloseButton size='sm' onClick={abortExecution}/></HStack>
            </VStack>
        </Box>
    )
}

export default ExecutionCard