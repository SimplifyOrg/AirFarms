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
    
    const handleClick = async () => {

        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        await authProvider.authGet(`/activity/execution/handle/?id=${props.execution.id}`, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            setExecution(res.data[0])
            setWorkflow('generate_new_hash_here')
            navigate('/workflow', {
                state: {
                workflow: JSON.parse(res.data[0].jsonFlow)
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
            navigate('/farm')
        })
        .catch(error => {
            console.log(error);
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