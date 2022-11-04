import React, {useContext, useEffect, useState} from 'react'
import {
    Text,
    VStack,
    Box,
    Image,
    useColorModeValue,
    HStack,
    CloseButton,
} from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import UserContext from '../../utils/UserContext'
import WorkflowContext from '../../utils/WorkflowContext'
import {AuthProvider} from '../../utils/AuthProvider'
import JsonFlowContext from '../../utils/JsonFlowContext'

function WorkflowCard(props) {
    const locale = 'en';
    const { user } = useContext(UserContext);
    const [flowid, setFlowid] = useState(-1)
    const navigate = useNavigate()
    const { workflow, setWorkflow } = useContext(WorkflowContext);
    
    useEffect(() => {   
        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
        }     
        const authProvider = AuthProvider()
        authProvider.authGet(`/activity/json-workflow/handle/?workflow=${props.workflow.workflow.id}&&archived=${false}&&ordering=-id`, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            if(res.data.length > 0)
            {
                setFlowid(res.data[0].id)
            }
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })

    }, []);    

    const handleClick = () => {
        setWorkflow('generate_new_hash_here')
        navigate('/workflow', {
            state: {
              workflow: props.workflow,
            }
          })
    }
    
    const archiveWorkflow = () => {

        const archive = {
            archived: true,
        }

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        authProvider.authPatch(`/activity/json-workflow/handle/${flowid}/`, archive, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            authProvider.authPatch(`/activity/workflow/handle/${props.workflow.workflow.id}/`, archive, config)
            .then(res =>{
                console.log(res);
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })
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
                        <HStack><Text noOfLines={1}>{props.workflow.workflow.title}</Text><CloseButton size='sm' onClick={archiveWorkflow}/></HStack>
                        <Image 
                        h={'120px'}
                        w={'full'}
                        src='https://mpng.subpng.com/20180505/joq/kisspng-computer-icons-workflow-gender-symbol-flowchart-ta-planings-5aedb7f6c96c54.9587564815255285668251.jpg'
                        objectFit={'cover'} />
                    </VStack>
                </Box>

    )
}

export default WorkflowCard
