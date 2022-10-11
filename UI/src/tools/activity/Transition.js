import React, {useContext, useState, useEffect} from 'react'
import {Form, Formik} from 'formik'
import FormikControl from '../../components/FormikControl';
import * as Yup from 'yup'
import { HStack, Button, Select, Wrap, FormControl } from '@chakra-ui/react';
import FarmContext from '../../utils/FarmContext'
import WorkflowContext from '../../utils/WorkflowContext'
import Approver from './Approver';
import { AuthProvider } from '../../utils/AuthProvider';

function Transition(props) {

    let initialApprovers = []
    let initSet = new Set()
    const { farm } = useContext(FarmContext);
    const { workflow, setWorkflow } = useContext(WorkflowContext);
    const [transitionid, SetTransitionid] = useState(-1);
    const [approvals, SetAppovals] = useState([])
    const [approvers, SetApprovers] = useState(initialApprovers)

    const getTransitionId = () => {
        SetTransitionid(transitionid+1)
        return transitionid+1
    }

    useEffect(() => {
        // Get all available approvers
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
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
                            if(!initSet.has(res.data[i].id))
                            {
                                initSet.add(res.data[i].id)
                                initialApprovers.push(res.data[i])
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
    }, [approvals])

    const addTransitionApproval = (transitionApproval) => {

        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(workflow);
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

        // Add new work to the node index retrived 
        // from above loop.
        if(edgeIndex !== -1)
        {
            // Add transition approvals to transition on edge
            currWorkflow.edges[edgeIndex].data.transition.transitionapprovals.push(transitionApproval)
            SetAppovals(currWorkflow.edges[edgeIndex].data.transition.transitionapprovals)
            setWorkflow(JSON.stringify(currWorkflow))
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
                    <Approver key={idx} id={approver.approver} addApprover={props.addApprover} />
                )
                })
            }
        </Wrap>
    </>
  )
}

export default Transition