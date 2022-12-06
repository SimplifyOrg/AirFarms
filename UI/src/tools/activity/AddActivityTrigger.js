import React, {useEffect, useContext, useState} from 'react'
import { AuthProvider } from '../../utils/AuthProvider'
import {useToast, HStack, Button} from '@chakra-ui/react'
import FarmContext from '../../utils/FarmContext'
import ExecutionContext from '../../utils/ExecutionContext';
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'

function AddActivityTrigger({onNewTrigger, node}) {

    const toast = useToast()

    const [workflows, SetWorkflows] = useState(new Map())
    const addWorkflow = (key, value) => {
        SetWorkflows(new Map(workflows.set(key, value)))
    }
    const {farm} = useContext(FarmContext)
    const {execution} = useContext(ExecutionContext)
    
    useEffect(() => {

        if(execution === null)
        {
            const authProvider = AuthProvider()
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }

            authProvider.authGet(`/activity/workflow/handle/?farm=${farm.id}&&archived=${false}&&ordering=title`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                for(let i = 0; i < res.data.length; ++i)
                {
                    addWorkflow(res.data[i].id, res.data[i])
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }, [])

    const validationSchema = Yup.object({
        workflow: Yup.string()
            .required('Required'),
    })

    const initialValues = {
        approver: ''
    }

    const onSubmitTrigger = (values, onSubmitProps) => {

        if(execution === null)
        {
            let config = {
                headers: {
                'Content-Type': 'application/json'
                }
            }

            const data = {
                workflowToTrigger : parseInt(values.workflow),
                associatedState : node
            }

            const authProvider = AuthProvider()
            authProvider.authPost(`/activity/workflow/trigger/handle/`, data, config, false)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                onNewTrigger(res.data, workflows.get(parseInt(res.data.workflowToTrigger)))
                toast({
                    position: 'top',
                    title: `Success`,
                    description: `Added new workflow trigger.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            })
            .catch(error => {
                console.log(error);
                toast({
                    position: 'top',
                    title: `Failed`,
                    description: `Failed to add new workflow trigger.`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            })
        }
        else
        {
            // This probably is dead code
            // But keeping it to handle 
            // Some error scenario
            toast({
                position: 'top',
                title: `Failed`,
                description: `Workflow can not be editted from execution.`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }

    }

    return (
        <Formik
        initialValues={initialValues}
        onSubmit={onSubmitTrigger}
        validationSchema={validationSchema}>
        {formik => {
        return (
            <Form>
                <HStack>                                              
                    <FormikControl
                        control='comboBoxWorkflows'
                        placeholder='Activity to trigger'
                        name='workflow'
                        color="orange.400"
                        approvers={Array.from(workflows.values())}
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
    )
}

export default AddActivityTrigger