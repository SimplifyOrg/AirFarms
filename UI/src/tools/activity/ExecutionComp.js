import React, {useContext, useEffect, useState, useCallback} from 'react'
import Execution from './Execution';
import ExecutionList from './ExecutionList';
import {
    Box,
    useColorModeValue,
    Skeleton,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    TableCaption,
    TableContainer,
    Grid,
    GridItem,
    Text,
    useToast
} from '@chakra-ui/react'
import UserContext from '../../utils/UserContext';
import { AuthProvider } from '../../utils/AuthProvider';

function ExecutionComp({maxWidth}) {

    let initialWorkflows = []
    let initSet = new Set()
    const [workflowList, SetWorkflowList] = useState(initialWorkflows)
    const [loading, setLoading] = useState(true)    
    const toast = useToast()
    const {user} = useContext(UserContext)
    const [executions, SetExecutions] = useState(new Map())

    const add = (key, value) => {
        // SetExecutions(prev => new Map([...prev, [key, value]]))
        SetExecutions(new Map(executions.set(key, value)))
        // console.log(executions)
    }

    const onNewExecution = useCallback(
        (workflow, exec) => {
            let vec = executions.get(parseInt(workflow))
            vec.push(exec)
            add(parseInt(workflow), vec)
        }, [])

    useEffect(() => {
        if(user)
        {
            //Runs only on the first render
            // Get number of farms
            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()

            authProvider.authGet(`/farm/perform/manage/?user=${user.data.id}&&archived=${false}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                for(let i = 0; i < res.data.length; ++i)
                {
                    if(res.data[i])
                    {
                        //Runs only on the first render
                        let config = {
                        headers: {
                            'Accept': 'application/json'
                        }
                        }
                        const authProvider = AuthProvider()
                        authProvider.authGet(`/activity/json-workflow/handle/?farm=${res.data[i].id}&&archived=${false}&&ordering=-id`, config)
                        .then(res => {
                            console.log(res);
                            console.log(res.data);
                            for(let i = 0; i <  res.data.length; ++i)
                            {
                                if(!initSet.has(res.data[i].id))
                                {
                                    initSet.add(res.data[i].id)
                                    const flow = JSON.parse(res.data[i].jsonFlow)
                                    initialWorkflows.push(flow)
                                    SetWorkflowList(initialWorkflows.slice())
                                }
                            }
                            setLoading(false)
                        })
                        .catch(error => {
                            console.log(error);
                            console.log(error.data);
                            setLoading(false)
                            toast({
                                position: 'top',
                                title: `Sorry couldn't get your activities!`,
                                description: `Please try again in sometime.`,
                                status: 'error',
                                duration: 3000,
                                isClosable: true,
                            })
                        })

                    }
                }
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

        }

    }, [user]);

    useEffect(() => {
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        for(let j = 0; j < workflowList.length; ++j)
        {
            authProvider.authGet(`/activity/execution/handle/?associatedFlow=${workflowList[j].workflow.id}&&has_finished=${false}&&ordering=-startTime`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                add(workflowList[j].workflow.id, res.data)                    
            })
            .catch(error => {
                console.log(error);
            })
        }
    }, [workflowList])


                

    return (
        <Box 
                id="workflowList"
                maxH="450px"
                borderWidth="2px"
                borderRadius="lg"
                overflowY="auto"
                mt={1}                
                css={{
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'orange',
                        borderRadius: '24px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555'
                    }
                    }}
                >
                <Skeleton isLoaded={!loading} noOfLines={4} spacing='4'>
                    
                    <Box maxW={maxWidth}>
                        <Execution onNewExecution={onNewExecution}/>
                    </Box>
                    <Grid gap={6}>
                    <GridItem>
                    <TableContainer>
                    <Table variant='striped' colorScheme='teal'>
                        <TableCaption placement="Top">Activity status</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Start time</Th>
                                <Th>Initiater</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        {
                            workflowList.length === 0 || executions.size === 0 ? <Text>No activity here, initiate workflows...</Text>: workflowList.map((workflowBody, idx) => {
                            return(                                
                                        <ExecutionList key={idx} workflow={workflowBody} executions={executions.get(workflowBody.workflow.id)}/>
                            )
                            })
                        }
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Start time</Th>
                                <Th>Initiater</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                    </TableContainer>
                    </GridItem>
                    </Grid>
                </Skeleton>
            </Box>
    )
}

export default ExecutionComp