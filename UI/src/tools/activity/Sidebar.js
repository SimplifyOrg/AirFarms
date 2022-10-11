import { Button } from '@chakra-ui/react';
import React, {useState, useContext} from 'react';
import {  useReactFlow } from 'react-flow-renderer';
import {AuthProvider} from '../../utils/AuthProvider'
import FarmContext from '../../utils/FarmContext'
import WorkflowContext from '../../utils/WorkflowContext';
import UserContext from '../../utils/UserContext';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const { farm } = useContext(FarmContext);
  const { user } = useContext(UserContext);
  const { workflow } = useContext(WorkflowContext);
  const [reactFlowInstance, SetReactFlowInstance] = useState(useReactFlow())
//   const [workflow, SetWorkflow] = useState(null)

  const onSave = () => {
    if (reactFlowInstance) {
        const flow = reactFlowInstance.toObject();
        const flowJSON = JSON.stringify(flow);
        console.log(flowJSON);
        console.log(workflow);
        const workflowObj = JSON.parse(workflow)

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
        authProvider.authPost(`/activity/workflow/handle/`, dataWorkflow, config, false)
        .then(resWorkflow =>{
            console.log(resWorkflow)
            if(workflow !== null)
            {
                const data = {
                    jsonFlow: workflow,
                    workflow: resWorkflow.data.id,
                    farm: farm.id
                }
                authProvider.authPost(`/activity/json-workflow/handle/`, data, config, false)
                .then(res =>{
                    console.log(res);
                    console.log(res.data);
                    // SetWorkflow(JSON.stringify(res.data))
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
        // else
        // {
        //     authProvider.authPatch(`/activity/json-workflow/handle/`, data, config, false)
        //     .then(res =>{
        //         console.log(res);
        //         console.log(res.data);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         console.log(error.data);
        //     })  
        // }
              
    }
  }

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
      <Button onClick={onSave}>save</Button>
    </aside>
  );
};