import React, {useState, useEffect, useContext} from 'react'
import {
    WrapItem,
    Avatar,
    AvatarBadge,
    Checkbox
} from '@chakra-ui/react'
import { AuthProvider } from '../../utils/AuthProvider'
import WorkflowContext from '../../utils/WorkflowContext'
import FarmContext from '../../utils/FarmContext'
import JsonFlowContext from '../../utils/JsonFlowContext'

function Approver(props) {

    const [user, SetUser] = useState(null)
    const [picture, SetPicture] = useState(null)
    const [approval, SetApproval] = useState(undefined)
    const {workflow} = useContext(WorkflowContext)
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)
    const {farm} = useContext(FarmContext)
    
    useEffect(() => {
        if(props.id !== 0)
        {
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }

            SetApproval(props.approval)
            
            // Get approver object
            const authProvider = AuthProvider()
            authProvider.authGet(`/account/user/?id=${props.id}`, config)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                SetUser(res.data[0])

                // Get approver's profile picture
                authProvider.authGet(`/account/profilepicture/?user=${props.id}`, config)
                .then(resPic =>{
                    console.log(resPic);
                    console.log(resPic.data);
                    SetPicture(resPic.data[0].image)
                    const data = {
                        approver: res.data[0],
                        picture: resPic.data[0].image
                    }

                    // Set the approver for top level
                    // transition class
                    props.addApprover(data)
                })
                .catch(errorPic => {
                    console.log(errorPic);
                    console.log(errorPic.data);
                })

            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

            
        }
    }, [])

    const patchWorkflow = (workflowObj) => {
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
                    // setWorkflow(resJSON.data.jsonFlow)
                    localStorage.setItem(workflow, JSON.stringify(workflowObj));
                    setJsonFlow(resJSON.data)
                })
                .catch(errorJSON => {
                    console.log(errorJSON);
                    console.log(errorJSON.data);
                })
            }
            // set workflow context with updated workflow object with database ids
            // setWorkflow(resJSON.data.jsonFlow)
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        }) 
    }

    const updateWorkflow = (e) => {
        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(localStorage.getItem(workflow));
        let edgeIndex = -1;

        // TODO: optimize
        // Iterate over all edges the get the current 
        // edge's index
        for(let i = 0; i < currWorkflow.edges.length; ++i)
        {
            if(props.edge.id === currWorkflow.edges[i].id)
            {
                edgeIndex = i;
                break;
            }
        }

        if(edgeIndex !== -1)
        {
            for(let i = 0; i < currWorkflow.edges[edgeIndex].data.transition.transitionapprovals.length; ++i)
            {
                if(approval?.id === currWorkflow.edges[edgeIndex].data.transition.transitionapprovals[i].id)
                {
                    currWorkflow.edges[edgeIndex].data.transition.transitionapprovals[i].approval = e;
                    SetApproval(currWorkflow.edges[edgeIndex].data.transition.transitionapprovals[i])
                    patchWorkflow(currWorkflow)
                    break;
                }
            }
        }
    }

    const sendApproval = (e) => {
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        
        const finished = {
            approval: e.target.checked
        }
        // props.approval.approval = e.target.checked
        authProvider.authPatch(`/activity/transition-approval/handle/${approval?.id}/`, finished, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            updateWorkflow(res.data.approval)
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })
    }

  return (
    <WrapItem>
        <Avatar name={user === null? '':user.first_name} src={picture}>
            <AvatarBadge variant='outline' colorScheme='green'>
                {approval !== undefined? <Checkbox isChecked={approval.approval || approval.approval === 'true'} size='sm' colorScheme='green' borderColor='blue.400' id={props.id} onChange={(e)=>{sendApproval(e)}}></Checkbox>:<Checkbox size='sm' colorScheme='green' borderColor='gray.400' isDisabled></Checkbox>}
            </AvatarBadge>
        </Avatar>
    </WrapItem>
  )
}

export default Approver