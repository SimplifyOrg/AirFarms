import React, {useContext, useState, useEffect} from 'react'
import {Form, Formik} from 'formik'
import FormikControl from '../../components/FormikControl';
import * as Yup from 'yup'
import { HStack, Button, Select, Wrap, FormControl } from '@chakra-ui/react';
import FarmContext from '../../utils/FarmContext'
import WorkflowContext from '../../utils/WorkflowContext'
import UserContext from '../../utils/UserContext';
import Approver from './Approver';
import { AuthProvider } from '../../utils/AuthProvider';
import { useReactFlow } from 'react-flow-renderer';
import useWorflow from './useWorflow';


function Transition(props) {

    let initialApprovers = []
    let initSet = new Set()
    const { farm } = useContext(FarmContext);
    const { workflow } = useContext(WorkflowContext);
    const { user } = useContext(UserContext);
    const [transitionid, SetTransitionid] = useState(-1);
    let initialApprovals = []
    let initApprovals = new Map()
    const [approvals, SetAppovals] = useState(initialApprovals)
    const [approvers, SetApprovers] = useState(initialApprovers)
    const reactFlowInstance = useReactFlow();
    const {saveWorkflow} = useWorflow(farm, user, reactFlowInstance.setNodes, reactFlowInstance.setEdges)

    const getTransitionId = () => {
        SetTransitionid(transitionid+1)
        return transitionid+1
    }

    useEffect(() => {
        // When loading list of approvers will all ready
        // be set. Update UI with current list of approvers
        // const workflowObj = JSON.parse(workflow)
        for(let i = 0; i < props.edge.data?.transition?.transitionapprovals?.length; ++i)
        {
            if(!initApprovals.has(props.edge.data?.transition?.transitionapprovals[i].approver))
            {
                initApprovals.set([props.edge.data?.transition?.transitionapprovals[i].approver, props.edge.data?.transition?.transitionapprovals[i]])
                initialApprovals.push(props.edge.data?.transition?.transitionapprovals[i])
            }
            SetAppovals(initialApprovals.slice())
        }

    },[approvals])

    useEffect(() => {
        // Get all available approvers
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        // Get list of all approvers
        // These will appear in the drop down on the edge
        if(farm !== null)
        {
        authProvider.authGet(`/farm/perform/group/?farm=${farm.id}`, config)
        .then(resPic =>{
            console.log(resPic);
            console.log(resPic.data);
            //TODO: optimize: probably fetch user and all farm related
            //      details at farm load.
            for(let i = 0; i < resPic.data.length; ++i)
            {
                let farmName = farm.name.toLowerCase() +'_group'
                let groupName = (resPic.data[i].name).toLowerCase() 
                if(farmName === groupName)
                {
                    const groupId = resPic.data[i].id
                    authProvider.authGet(`/account/user/?groups=${groupId}`, config)
                    .then(res =>{
                        console.log(res);
                        console.log(res.data);
                        for(let j = 0; j < res.data.length; ++j)
                        {
                            if(!initSet.has(res.data[j].id))
                            {
                                initSet.add(res.data[j].id)
                                initialApprovers.push(res.data[j])
                            }                            
                        }
                        SetApprovers(initialApprovers.slice())
                    })
                    .catch(error => {
                        console.log(error);
                        console.log(error.data);
                    })
                    break;
                }
            }
        })
        .catch(errorPic => {
            console.log(errorPic);
            console.log(errorPic.data);
        })
        }
    }, [])

    const sendNotification = (transitionApproval) => {
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        const body = {
            sender: user.data.id,
            receiver: transitionApproval.approver,
            notification_type: '1'
        }

        authProvider.authPost(`/notification/data/handle/`, body, config, false)
        .then(res =>{
            console.log(res);
            console.log(res.data);
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })
    }

    const addTransitionApproval = (transitionApproval) => {

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

        // Add new transition approval to the edge index retrived 
        // from above loop.
        if(edgeIndex !== -1 && !initApprovals.has(transitionApproval.approver))
        {
            // Add transition approvals to transition on edge
            currWorkflow.edges[edgeIndex].data.transition.transitionapprovals.push(transitionApproval)
            initialApprovals.push(transitionApproval)
            initApprovals.set([transitionApproval.approver, transitionApproval])
            // SetAppovals(currWorkflow.edges[edgeIndex].data.transition.transitionapprovals)
            SetAppovals(initialApprovals.slice())
            localStorage.setItem(workflow, JSON.stringify(currWorkflow));
            sendNotification(transitionApproval)
            saveWorkflow()
            // setWorkflow(JSON.stringify(currWorkflow))
        }
    }

    const onSubmitApprover = (values, onSubmitProps) => {
        
        let edge = props.edge;
        edge.data.transition.need_approval = true

        let transitionApproval = {
            id: getTransitionId(),
            transitionToApprove: edge.data.transition.id,
            approver: values.approver,
            approval: false,
            reject: false
        }

        // Add work to the selected node
        addTransitionApproval(transitionApproval)
    }

    const validationSchema = Yup.object({
    })

    const initialValues = {
        approver: ''
    }

  return (
    <>
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmitApprover}
            validationSchema={validationSchema}>
            {formik => {
            return (
                <Form>
                    <HStack>                                              
                        <FormikControl
                            control='comboBox'
                            placeholder='Select Approver'
                            name='approver'
                            color="orange.400"
                            approvers={approvers}
                        />
                        <Button 
                            type='submit' 
                            disabled={!formik.isValid}
                            width="half"
                            color="orange.400"
                        >
                            Add
                        </Button>
                    </HStack>
                </Form>
            )
        }}            
        </Formik>
        <Wrap>
            {
                approvals.length === 0 ? <></>: approvals.map((approver, idx) => {
                return(
                    <Approver key={idx} id={approver.approver} addApprover={props.addApprover} approval={approvals[idx]} edge={props.edge}/>
                )
                })
            }
        </Wrap>
    </>
  )
}

export default Transition