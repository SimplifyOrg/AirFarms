import React, {useContext, useState, useEffect, useCallback} from 'react'
import WorkflowDiagram from './activity/WorkflowDiagram'
// import NavBar from '../components/NavBar'
import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink
} from '@chakra-ui/react'
import {Link} from 'react-router-dom'
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useLocation } from "react-router-dom"
import FarmContext from '../utils/FarmContext'
import WorkflowContext from '../utils/WorkflowContext'
import UserContext from '../utils/UserContext'
import NavBar from '../components/navigation/NavBar'

function Workflow() {
    const location = useLocation();
    const [currworkflow, SetCurrworkflow] = useState(location?.state?.workflow)
    const [execution, SetExecution] = useState(null)
    const {workflow} = useContext(WorkflowContext)
    const {farm} = useContext(FarmContext)
    const {user} = useContext(UserContext)


    useEffect(() => {
        
        let inComingWorkflow = undefined
        if(location?.state?.workflow !== null && location?.state?.workflow !== undefined)
        {
            inComingWorkflow = location?.state?.workflow;
            if(location.state.execution !== null || location.state.execution !== undefined)
            {
                SetExecution(location.state.execution)
            }
        }
        
        let init = {
            nodes: [
                {
                    id: 'n1',
                    type: 'workflowNode',
                    data: { 
                        label: 'start',
                        title: 'start',
                        notifiers: [user.id],
                        notes: "",
                        works: []
                    },
                    position: { x: 50, y: 5 },
                },
            ],
            edges: [],
            roles:[]
        }

        if(currworkflow === undefined && inComingWorkflow === undefined)
        {
            // Most probably this is dead code
            // keeping this to handle exception scenarios.            
            let workflowInit = {
                workflow: {
                    id: "-1",
                    title: "New workflow",
                    has_finished: "false",
                    farm: farm,
                    owner: user.id,
                    startState: "-1",
                    is_production: "false"
                }

            }
            const workflowJSON = {...workflowInit, ...init} 
            const flowJSON = JSON.stringify(workflowJSON);
            SetCurrworkflow(flowJSON)
            localStorage.setItem(workflow, flowJSON);
        }
        else
        {
            // When new workflow is being created add default nodes and edges
            let initialWorkflow = inComingWorkflow === undefined? currworkflow : inComingWorkflow
            if(initialWorkflow.nodes === undefined || initialWorkflow.edges === undefined)
            {
                // let present = false;
                // for (let i = 0; i < initialWorkflow.workflow.currentStates.length; ++i)
                // {
                //     if(initialWorkflow.workflow.currentStates[i] === init.nodes[0].id)
                //     {
                //         present = true;
                //     }
                // }
                // if(!present)
                // {
                //     initialWorkflow.workflow.currentStates.push(init.nodes[0].id)
                // }   
                
                const workflowJSON = {...initialWorkflow, ...init}
                // const flowJSON = JSON.stringify(workflowJSON);
                SetCurrworkflow(workflowJSON)
                localStorage.setItem(workflow, JSON.stringify(workflowJSON));
            }
            else
            {
                // SetCurrworkflow(JSON.stringify(initialWorkflow))
                localStorage.setItem(workflow, JSON.stringify(initialWorkflow));
            }
            // localStorage.setItem(workflow, JSON.stringify(initialWorkflow));
        }

    }, [])

    // const updateWorkflow = useCallback( (workflowObj) => {

    // }, [])

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
                    <BreadcrumbLink as={Link} to='/farm'>{farm === undefined || farm === '' || farm === null? 'Farm':farm.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink as={Link} to='/workflow'>{currworkflow === undefined || currworkflow === '' || currworkflow === null? 'New workflow':currworkflow.workflow.title}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box 
            display='flex' 
            p='3' 
            maxW='bg' 
            alignItems='top' 
            height='600px' 
            borderWidth="2px" 
            borderRadius="lg"
            ml='2'
            mr='2'
            >
                <WorkflowDiagram workflow={currworkflow}/>
            </Box>
        </NavBar>
  )
}

export default Workflow