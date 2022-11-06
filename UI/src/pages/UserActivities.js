import React, {useState, useEffect, useContext} from 'react'
import {
    Grid,
    GridItem,
    Box,
    Text,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Skeleton,
    useToast
} from '@chakra-ui/react'
import {Link} from 'react-router-dom'
import { ChevronRightIcon } from '@chakra-ui/icons';
import WorkflowCard from '../components/workflow/WorkflowCard'
import CreateWorkflowCard from '../components/workflow/CreateWorkflowCard'
import {AuthProvider} from '../utils/AuthProvider'
import UserContext from '../utils/UserContext'
import NavBar from '../components/navigation/NavBar';

function UserActivities() {

    const { user } = useContext(UserContext);
    let initialWorkflows = []
    let initSet = new Set()
    const [workflowList, SetWorkflowList] = useState(initialWorkflows)
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        if(user)
        {
            //Runs only on the first render

            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()
            authProvider.authGet(`/activity/json-workflow/handle/?user=${user.data.id}&&archived=${false}&&ordering=-id`, config)
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
                    duration: 9000,
                    isClosable: true,
                  })
            })

        }

    }, []);


    return (
        <NavBar>
            <Breadcrumb marginBlock={1} spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to='/dashboard'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink as={Link} to='/user-workflow-list'>User Activities</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            
            <Box 
                id="workflowList"
                maxH="600px"
                borderWidth="2px"
                borderRadius="lg"
                overflowY="auto"
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
                    <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                    {
                        workflowList.length === 0 ? <Text>No activities owned by you...</Text>: workflowList.map((workflowBody, idx) => {
                        return(
                            <GridItem>
                                    <WorkflowCard key={idx} workflow={workflowBody}/>
                            </GridItem>
                        )
                        })
                    }
                    </Grid>
                </Skeleton>
            </Box>
        </NavBar>
  )
}

export default UserActivities