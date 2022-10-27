import React, {useContext, useState, useEffect} from 'react'
import {Form, Formik} from 'formik'
import FormikControl from '../../components/FormikControl';
import * as Yup from 'yup'
import { HStack, Button, Select, Wrap, FormControl } from '@chakra-ui/react';
import FarmContext from '../../utils/FarmContext'
import { AuthProvider } from '../../utils/AuthProvider';
import AssigneeList from './AssigneeList';

function Assignee(props) {

    let initialAssignees = []
    let initSet = new Set()
    const { farm } = useContext(FarmContext);
    const [assignees, SetAssignees] = useState(initialAssignees)

    let initialAssigned = []
    let assignedSet = new Set()
    const [assigned, SetAssigneed] = useState(initialAssigned)


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
                            if(!initSet.has(res.data[j].id))
                            {
                                initSet.add(res.data[j].id)
                                initialAssignees.push(res.data[j])
                            }                            
                        }
                        SetAssignees(initialAssignees.slice())
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

    useEffect(() => {

    }, [assigned])

    // const addNodeAssignee = (assigneeId) => {

    //     // Get current workflow's JSON object
    //     // let currWorkflow = JSON.parse(workflow);
    //     let workIndex = -1;

    //     // TODO: optimize
    //     // Iterate over all edges the get the current 
    //     // edge's index
    //     for(let i = 0; i < props.node.data.works.length; ++i)
    //     {
    //         if(props.work.id === props.node.data.works[i].id)
    //         {
    //             workIndex = i;
    //             break;
    //         }
    //     }

    //     // Add new work to the node index retrived 
    //     // from above loop.
    //     if(edgeIndex !== -1)
    //     {
    //         // Add transition approvals to transition on edge
    //         props.node.data.works[edgeIndex].assignee.push(assigneeId)
    //         // SetAppovals(currWorkflow.edges[edgeIndex].data.transition.transitionapprovals)
    //         setWorkflow(JSON.stringify(currWorkflow))
    //     }
    // }

    const onSubmitAssignee = (values, onSubmitProps) => {
        // 
        if(!assignedSet.has(values.assignee))
        {
            assignedSet.add(values.assignee)
            initialAssigned.push(values.assignee)
            SetAssigneed(initialAssigned)
            // props.addAssigneeInWork(values.assignee)
        }
        
    }

    const validationSchema = Yup.object({
    })

    const initialValues = {
        assignee: ''
    }

  return (
    <>
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmitAssignee}
            validationSchema={validationSchema}>
            {formik => {
            return (
                <Form>
                    <HStack>                                              
                        <FormikControl
                            control='comboBox'
                            placeholder='Select Assignee'
                            name='assignee'
                            color="orange.400"
                            approvers={assignees}
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
                assigned.length === 0 ? <></>: assigned.map((assignee, idx) => {
                return(
                    <AssigneeList key={idx} id={assignee} addAssignee={props.addAssigneeInWork} />
                )
                })
            }
        </Wrap>
    </>
  )
}

export default Assignee