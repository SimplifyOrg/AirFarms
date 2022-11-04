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
import JsonFlowContext from '../utils/JsonFlowContext'
import NavBar from '../components/navigation/NavBar'
import { AuthProvider } from '../utils/AuthProvider'

function Workflow() {
    const location = useLocation();
    const [currworkflow, SetCurrworkflow] = useState(location?.state?.workflow)
    const {workflow} = useContext(WorkflowContext)
    const {farm} = useContext(FarmContext)
    const {user} = useContext(UserContext)
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)

    useEffect(() => {
        
        let inComingWorkflow = undefined
        if(location?.state?.workflow !== null && location?.state?.workflow !== undefined)
        {
            inComingWorkflow = location?.state?.workflow;
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
            edges: []
        }

        if(currworkflow === undefined && inComingWorkflow === undefined)
        {
            // Most probably this is dead code
            // keeping this to handle exception scenarios.            
            let workflowInit = {
                workflow: {
                    id: "-1",
                    title: "New workflow",
                    currentStates: ['n1'],
                    has_finished: "false",
                    farm: farm,
                    owner: user.id,
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
                let present = false;
                for (let i = 0; i < initialWorkflow.workflow.currentStates.length; ++i)
                {
                    if(initialWorkflow.workflow.currentStates[i] === init.nodes[0].id)
                    {
                        present = true;
                    }
                }
                if(!present)
                {
                    initialWorkflow.workflow.currentStates.push(init.nodes[0].id)
                }   
                
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

    const createWorkflow = (authProvider, dataWorkflow, workflowObj, config) => {
        authProvider.authPost(`/activity/workflow/handle/`, dataWorkflow, config, false)
        .then(resWorkflow =>{
            console.log(resWorkflow)
            if(workflow !== null)
            {
                // Update workflow id with the database id of the workflow
                workflowObj.workflow.id = resWorkflow.data.id
                const data = {
                    jsonFlow: JSON.stringify(workflowObj),
                    workflow: resWorkflow.data.id,
                    farm: farm.id
                }
                authProvider.authPost(`/activity/json-workflow/handle/`, data, config, false)
                .then(res =>{
                    console.log(res);
                    console.log(res.data);
                    // set workflow context with updated workflow object with database ids
                    SetCurrworkflow(res.data.jsonFlow)
                    setJsonFlow(res.data)
                    localStorage.setItem(workflow, res.data.jsonFlow);
                    // SetReactFlowInstance(JSON.parse(res.data.jsonFlow))
                })
                .catch(error => {
                    console.log(error);
                    console.log(error.data);
                })  
            }
        })
        .catch(errorWorkflow => {
            console.log(errorWorkflow);
            console.log(errorWorkflow.data);
        })
    }

    // const updateWorkflow = useCallback( (workflowObj) => {

    // }, [])

    const patchWorkflow = useCallback( (workflowObj) => {
        const authProvider = AuthProvider()
        const JSONdata = {
            jsonFlow: JSON.stringify(workflowObj),
            workflow: workflowObj.workflow.id,
            farm: farm.id
        }
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        authProvider.authGet(`/activity/json-workflow/handle/?workflow=${workflowObj.workflow.id}`, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            if(res.data.length !== 0)
            {
                authProvider.authPut(`/activity/json-workflow/handle/${res.data[0].id}/`, JSONdata, config)
                .then(resJSON =>{
                    console.log(resJSON);
                    console.log(resJSON.data);
                    // set workflow context with updated workflow object with database ids
                    SetCurrworkflow(resJSON.data.jsonFlow)
                    setJsonFlow(resJSON.data)
                    localStorage.setItem(workflow, resJSON.data.jsonFlow);
                    // setReactFlowInstance(JSON.parse(resJSON.data.jsonFlow))
                })
                .catch(errorJSON => {
                    console.log(errorJSON);
                    console.log(errorJSON.data);
                })
            }
            else
            {
                const dataWorkflow = {
                    farm: farm.id,
                    owner: user.data.id,
                    title: workflowObj.workflow.title
                }
                createWorkflow(authProvider, dataWorkflow, workflowObj, config)
            }
            // set workflow context with updated workflow object with database ids
            // SetCurrworkflow(resJSON.data.jsonFlow)
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        }) 
    })

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
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink as={Link} to='/workflow'>{currworkflow === undefined || currworkflow === ''? 'New workflow':currworkflow.workflow.title}</BreadcrumbLink>
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
                <WorkflowDiagram patchWorkflow={patchWorkflow} workflow={currworkflow}/>
            </Box>
        </NavBar>
  )
}

export default Workflow