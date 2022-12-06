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
import ExecutionContext from '../../utils/ExecutionContext'
import UserContext from '../../utils/UserContext'
import useWorflow from './useWorflow'
import {useReactFlow} from 'react-flow-renderer'

function Approver(props) {

    const [userlocal, SetUserlocal] = useState(null)
    const [picture, SetPicture] = useState(null)
    const [approval, SetApproval] = useState(undefined)
    const {workflow} = useContext(WorkflowContext)
    const {execution} = useContext(ExecutionContext)
    const {jsonFlow, setJsonFlow} = useContext(JsonFlowContext)
    const {farm} = useContext(FarmContext)
    const {user} = useContext(UserContext)
    const reactFlowInstance = useReactFlow();
    const {saveWorkflow} = useWorflow(farm, userlocal, reactFlowInstance.setNodes, reactFlowInstance.setEdges)

    // const onDragOver = useCallback((transitionApproval) => {
    //     event.preventDefault();
    //     event.dataTransfer.dropEffect = 'move';
    //   }, []);
    
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
                SetUserlocal(res.data[0])

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
                })

            })
            .catch(error => {
                console.log(error);
            })

            
        }
    }, [])

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
                    localStorage.setItem(workflow, JSON.stringify(currWorkflow));                    
                    saveWorkflow()
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

        const workflowObj = JSON.parse(localStorage.getItem(workflow))
        let edgeIndex = -1;

        for(let i = 0; i < workflowObj?.edges?.length; ++i)
        {
            if(props.edge.id === workflowObj.edges[i].id)
            {
                edgeIndex = i;
                break;
            }
        }

        let updatedId = -1;

        for(let j = 0; edgeIndex >= 0 && j < workflowObj?.edges[edgeIndex]?.data?.transition?.transitionapprovals?.length; ++j)
        {
            if(workflowObj.edges[edgeIndex].data.transition.transitionapprovals[j].approver === props.approval.approver)
            {
                // workflowObj.edges[edgeIndex].data.transition.transitionapprovals[i] = workflowObj.edges[edgeIndex].data.transition.transitionapprovals[j]
                SetApproval(workflowObj.edges[edgeIndex].data.transition.transitionapprovals[j])
                updatedId = workflowObj.edges[edgeIndex].data.transition.transitionapprovals[j].id;
            }
        }

        let id = edgeIndex >=0 ? updatedId : approval?.id

        const authProvider = AuthProvider()
        
        const finished = {
            approval: e.target.checked
        }
        // props.approval.approval = e.target.checked
        authProvider.authPatch(`/activity/execution/transition-approval/handle/${id}/`, finished, config)
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
        <Avatar name={userlocal === null? '':userlocal.first_name} src={picture}>
            {execution !== null && user.data.id === userlocal.id?<AvatarBadge variant='outline' colorScheme='green'>
                {approval !== undefined ? <Checkbox isChecked={approval.approval || approval.approval === 'true'} size='sm' colorScheme='green' borderColor='blue.400' id={props.id} onChange={(e)=>{sendApproval(e)}}></Checkbox>:<Checkbox size='sm' colorScheme='green' borderColor='gray.400' isDisabled></Checkbox>}
            </AvatarBadge>:<></>}
        </Avatar>
    </WrapItem>
  )
}

export default Approver