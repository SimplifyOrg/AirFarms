import { Button } from '@chakra-ui/react';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import {  useReactFlow } from 'react-flow-renderer';
import {AuthProvider} from '../../utils/AuthProvider'
import FarmContext from '../../utils/FarmContext'
import WorkflowContext from '../../utils/WorkflowContext';
import UserContext from '../../utils/UserContext';
import JsonFlowContext from '../../utils/JsonFlowContext';
import {useNavigate} from 'react-router-dom'

export default (props) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const { farm } = useContext(FarmContext);
    const { user } = useContext(UserContext);
    const { workflow } = useContext(WorkflowContext);
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)
    const [reactFlowInstance, SetReactFlowInstance] = useState(useReactFlow())
    //   const [workflow, SetWorkflow] = useState(null)
    const navigate = useNavigate()

    const onSaveLocal = useCallback(() => {
        let flow = reactFlowInstance.toObject()
        localStorage.setItem(workflow, JSON.stringify(flow));
    }, [reactFlowInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = JSON.parse(localStorage.getItem(workflow));

            if (flow) {
                // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                props.setNodes(flow.nodes || []);
                props.setEdges(flow.edges || []);
                // setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [props.setNodes]);

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
                    // setWorkflow(res.data.jsonFlow)
                    localStorage.setItem(workflow, res.data.jsonFlow);
                    onRestore()
                    setJsonFlow(res.data)
                    navigate('/workflow', {
                        state: {
                          workflow: JSON.parse(res.data.jsonFlow),
                        }
                      })
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

    const onSave = () => {
    if (reactFlowInstance) {
        const flow = reactFlowInstance.toObject();
        const flowJSON = JSON.stringify(flow);
        console.log(flowJSON);
        console.log(workflow);
        const workflowObj = JSON.parse(localStorage.getItem(workflow))

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
        authProvider.authGet(`/activity/workflow/handle/?id=${workflowObj.workflow.id}`, config)
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
  }

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Node
      </div>
      {/* <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div> */}
      <Button onClick={onSave}>save</Button>
    </aside>
  );
};