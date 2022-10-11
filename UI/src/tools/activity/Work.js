import React, {useContext, useState} from 'react'
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { HStack, Button, Box } from '@chakra-ui/react';
import UserContext from '../../utils/UserContext'
import WorkflowContext from '../../utils/WorkflowContext'
import NodeContext from '../../utils/NodeContext';

function Work(props) {

    const { user } = useContext(UserContext);
    const { node } = useContext(NodeContext);
    const { workflow, setWorkflow } = useContext(WorkflowContext);
    const [workid, SetWorkid] = useState(-1);

    const getWorkId = () => {
        SetWorkid(workid+1)
        return workid+1
    }
    
    const addWork = (nodeId, workObj) => {

        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(workflow);
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
            setWorkflow(JSON.stringify(currWorkflow))
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
        const work = {
            id: getWorkId(),
            assignee: [user.data.id],
            notifiers: [user.data.id],
            notes: values.notes,
            associatedState: node?.id,
            completion_date: "",
            has_finished: "false",
            is_halted: "false"
        }

        // Add work to the selected node
        addWork(node?.id, work)

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
        // <Box bg='#BFD1FD' maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
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
        // </Box>
  )
}

export default Work