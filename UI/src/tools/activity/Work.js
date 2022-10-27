import React, {useContext, useState, useCallback} from 'react'
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { HStack, Button, Box } from '@chakra-ui/react';
import UserContext from '../../utils/UserContext'
import WorkflowContext from '../../utils/WorkflowContext'
import NodeContext from '../../utils/NodeContext';
import Assignee from './Assignee';

function Work(props) {

    const { user } = useContext(UserContext);
    const { node } = useContext(NodeContext);
    const { workflow, setWorkflow } = useContext(WorkflowContext);
    const [workid, SetWorkid] = useState(0);
    let initialAssignee = []
    let assigneeSet = new Set()
    const [assignees, SetAssignees] = useState(initialAssignee)

    const getWorkId = () => {
        SetWorkid(workid+1);
        return `${node.id}${workid}`;
    }

    const addAssignee = useCallback((user) => {
        
        if(!assigneeSet.has(user.assignee.id))
        {
            assigneeSet.add(user.assignee.id)
            initialAssignee.push(user)
            SetAssignees(initialAssignee.slice())
            // props.addAssignee(user)
        }

    }, [assignees]);
    
    const addWork = (nodeId, workObj) => {

        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(localStorage.getItem(workflow));
        let nodeIndex = -1;

        // Iterate over all nodes and find the node
        // to add the new work
        for(let i = 0; i < currWorkflow.nodes.length; ++i)
        {
            if(currWorkflow.nodes[i].id == node.id)
            {
                nodeIndex = i
                break;
            }
        }

        // Add new work to the node index retrived 
        // from above loop.
        if(nodeIndex != -1)
        {
            currWorkflow.nodes[nodeIndex].data.works.push(workObj)
            // setWorkflow(JSON.stringify(currWorkflow))
            localStorage.setItem(workflow, JSON.stringify(currWorkflow));
            props.onChange(workObj)
        }
        
        // const data = {
        //     assignee: [user.data.id],
        //     notifiers: [user.data.id],
        //     notes : values.notes,
        //     associatedState: props.state
        //   };

        // let config = {
        //     headers: {
        //       'Content-Type': 'application/json'
        //     }
        //   }
        // const authProvider = AuthProvider()
        // authProvider.authPost(`/activity/work/handle/`, data, config, false)
        // .then(res =>{
        //     console.log(res);
        //     console.log(res.data);
        //     onSubmitProps.resetForm()
        // })
        // .catch(error => {
        //     console.log(error);
        //     console.log(error.data);
        // })
    }

    const onSubmit = (values, onSubmitProps) => {
        
        let ass = []
        assignees.forEach(item => ass.push(item.assignee.id))
        
        if(!assigneeSet.has(user.data.id))
        {
            assigneeSet.add(user.data.id)
            ass.push(user.data.id)
        }
        
        const work = {
            id: `temp_${getWorkId()}`,
            assignee: ass,
            notifiers: ass,
            notes: values.notes,
            associatedState: node?.id,
            completion_date: "",
            has_finished: "false",
            is_halted: "false"
        }

        // Add work to the selected node
        addWork(node?.id, work)

        props.addAssignee(assignees)

        // Clear the form fields
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
    }
    
    //Schema to validate data in fields of the form
    const validationSchema = Yup.object({
        notes: Yup.string()
            .required('Required'),
    })

    const initialValues = {
        notes: ''
    }

  return (
        <Box bg='#BFD1FD' maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                {formik => {
                return (
                    <Form>
                        <HStack>                                              
                            <FormikControl
                                control='chakraTextArea'
                                type='text'
                                label='Notes'
                                name='notes'
                                required
                                color="orange.400"
                                placeholder="Describe the work..."
                            />
                            <Button 
                                type='submit' 
                                disabled={!formik.isValid}
                                width="half"
                                color="orange.400"
                            >
                                Create
                            </Button>
                        </HStack>
                    </Form>
                )
            }}            
            </Formik>
            <Assignee addAssigneeInWork={addAssignee}/>
        </Box>
  )
}

export default Work