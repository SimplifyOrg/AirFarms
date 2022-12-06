import React, {useContext, useCallback} from 'react'
import { AuthProvider } from '../../utils/AuthProvider'
import {useNavigate} from 'react-router-dom'
import JsonFlowContext from '../../utils/JsonFlowContext'
import WorkflowContext from '../../utils/WorkflowContext'
import ExecutionContext from '../../utils/ExecutionContext'
import {useToast} from '@chakra-ui/react'

function useWorflow(farm, user, setNodes, setEdges) {

    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)
    const {workflow} = useContext(WorkflowContext)
    const {execution} = useContext(ExecutionContext)
    const navigate = useNavigate()
    const toast = useToast()

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            let flow = JSON.parse(localStorage.getItem(workflow));

            if (flow) {
                // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                // setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [setNodes]);

    const patchWorkflow = useCallback( async (workflowObj) => {
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
        await authProvider.authGet(`/activity/json-workflow/handle/?workflow=${workflowObj.workflow.id}`, config)
        .then(async res =>{
            console.log(res);
            console.log(res.data);
            if(res.data.length !== 0)
            {
                await authProvider.authPut(`/activity/json-workflow/handle/${res.data[0].id}/`, JSONdata, config)
                .then(resJSON =>{
                    console.log(resJSON);
                    console.log(resJSON.data);
                    // set workflow context with updated workflow object with database ids
                    // SetCurrworkflow(resJSON.data.jsonFlow)
                    setJsonFlow(resJSON.data)
                    localStorage.setItem(workflow, resJSON.data.jsonFlow);
                    onRestore()

                    navigate('/workflow', {
                        state: {
                          workflow: JSON.parse(resJSON.data.jsonFlow),
                        }
                    })
                    // SetReactFlowInstance(JSON.parse(resJSON.data.jsonFlow))
                })
                .catch(errorJSON => {
                    console.log(errorJSON);
                    console.log(errorJSON.data);
                })
            }
            // set workflow context with updated workflow object with database ids
            // SetCurrworkflow(resJSON.data.jsonFlow)
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        }) 
    })

    const updateStartState = async (authProvider, config, flow) => {

        const workflowObj = JSON.parse(flow)

        const dataWorkflow = {
            farm: farm.id,
            owner: user.data.id,
            title: workflowObj.workflow.title,
            startState: workflowObj.workflow.startState
        }

        await authProvider.authPut(`/activity/workflow/handle/${workflowObj.workflow.id}/`, dataWorkflow, config)
        .then(res => {

        })
        .catch(error => {
            toast({
                position: 'top',
                title: `Failed`,
                description: `Failed to set start state. Please set it manually.`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        })
    }
    

    const createWorkflow = async (authProvider, dataWorkflow, workflowObj, config) => {
        await authProvider.authPost(`/activity/workflow/handle/`, dataWorkflow, config, false)
        .then(async resWorkflow =>{
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
                await authProvider.authPost(`/activity/json-workflow/handle/`, data, config, false)
                .then(res =>{
                    console.log(res);
                    console.log(res.data);
                    // set workflow context with updated workflow object with database ids
                    localStorage.setItem(workflow, res.data.jsonFlow);
                    // Update start state in workflow
                    updateStartState(authProvider, config, res.data.jsonFlow)
                    onRestore()
                    setJsonFlow(res.data)
                    toast({
                        position: 'top',
                        title: `Activity saved`,
                        description: ``,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      })
                    navigate('/workflow', {
                        state: {
                          workflow: JSON.parse(res.data.jsonFlow),
                        }
                      })
                    // SetReactFlowInstance(JSON.parse(res.data.jsonFlow))
                })
                .catch(error => {
                    console.log(error);
                })  
            }
        })
        .catch(errorWorkflow => {
            console.log(errorWorkflow);
        })
    }

    const updateExecution = async (authProvider, dataExecution, config) => {

        await authProvider.authPut(`/activity/execution/handle/${execution.id}/`, dataExecution, config)
        .then(res => {
            navigate('/workflow', {
                state: {
                  workflow: JSON.parse(res.data.jsonFlow),
                }
              })            
        })
        .catch(error => {
            console.log(error);
        })

    }

    const patchExecution = async (workflowObj) => {
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        await authProvider.authGet(`/activity/execution/handle/?id=${execution.id}`, config)
        .then(res => {
            if(res.data.length !== 0)
            {
                let dataExecution = res.data[0]
                dataExecution.jsonFlow = JSON.stringify(workflowObj)
                updateExecution(authProvider, dataExecution, config)
            }
        })
        .catch(error => {
            console.log(error);
        })
    }    
    
    const saveWorkflow = async () => {

        const workflowObj = JSON.parse(localStorage.getItem(workflow))

        // Save workflow only when execution
        // is not loaded
        if(execution === null)
        {
            const dataWorkflow = {
                farm: farm.id,
                owner: user.data.id,
                title: workflowObj.workflow.title
            }

            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }
            const authProvider = AuthProvider()
            //TODO: Write code to update existing workflow
            await authProvider.authGet(`/activity/workflow/handle/?id=${workflowObj.workflow.id}`, config)
            .then(getWorkflow => {
                if(getWorkflow.data.length === 0)
                {
                    // Create new workflow if it doesn't exist
                    createWorkflow(authProvider, dataWorkflow, workflowObj, config)
                }
                else
                {
                    // Update existing workflow
                    patchWorkflow(workflowObj)
                }
            })
            .catch(errorGetWorkflow => {
                console.log(errorGetWorkflow);
                console.log(errorGetWorkflow.data);
            })
        }
        else
        {
            patchExecution(workflowObj)
        }

    }

    return {saveWorkflow}
}

export default useWorflow