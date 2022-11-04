import React, {useState, useEffect, useContext} from 'react'
import {
    Grid,
    GridItem,
    Box,
    Text,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink
} from '@chakra-ui/react'
import {Link} from 'react-router-dom'
import { ChevronRightIcon } from '@chakra-ui/icons';
import WorkflowCard from './WorkflowCard'
import CreateWorkflowCard from './CreateWorkflowCard'
import {AuthProvider} from '../../utils/AuthProvider'
import FarmContext from '../../utils/FarmContext'
import NavBar from '../navigation/NavBar'

function WorkflowList(props) {

    const { farm } = useContext(FarmContext);
    let initialWorkflows = []
    let initSet = new Set()
    const [workflowList, SetWorkflowList] = useState(initialWorkflows)

    useEffect(() => {
        if(farm)
        {
            //Runs only on the first render

            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()
            authProvider.authGet(`/activity/json-workflow/handle/?farm=${farm.id}&&archived=${false}&&ordering=-id`, config)
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
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
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
                    <BreadcrumbLink as={Link} to='/farms'>Farms</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink as={Link} to='/workflow-list'>Workflows</BreadcrumbLink>
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
            <Grid templateColumns='repeat(5, 1fr)' gap={6}>
            <GridItem>
                <CreateWorkflowCard/>
            </GridItem>
            {
                workflowList.length === 0 ? <Text>No activity here, add workflows...</Text>: workflowList.map((workflowBody, idx) => {
                return(
                    <GridItem>
                            <WorkflowCard key={idx} workflow={workflowBody}/>
                    </GridItem>
                )
                })
            }
            </Grid>
            </Box>
        </NavBar>
        
    )
}

export default WorkflowList
