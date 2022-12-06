import React, {useEffect, useState, useContext} from 'react'
import { AuthProvider } from '../../utils/AuthProvider'
import FarmContext from '../../utils/FarmContext'
import UserContext from '../../utils/UserContext';
import ExecutionContext from '../../utils/ExecutionContext';
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import {
    useToast,
    HStack,
    Button
} from '@chakra-ui/react'

function Execution({onNewExecution}) {
    
    let initialWorkflows = []
    let workflowsSet = new Set()
    const [workflows, SetWorkflows] = useState(initialWorkflows)
    const {farm} = useContext(FarmContext)
    const {user} = useContext(UserContext)
    const {execution, setExecution} = useContext(ExecutionContext)
    const toast = useToast()
    
    useEffect(() => {
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
                if(!workflowsSet.has(res.data[i].id))
                {
                    workflowsSet.add(res.data[i].id)
                    initialWorkflows.push(res.data[i])
                }
            }
            SetWorkflows(initialWorkflows.slice())
        })
        .catch(error => {
            console.log(error);
        })
    }, [])

    const onSubmitworkflow = (values, onSubmitProps) => {        
        
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        let startState = -1;
        let index = -1;

        for(let i = 0; i < workflows.length; ++i)
        {
            if(workflows[i].id === parseInt(values.workflow))
            {
                startState = workflows[i].startState;
                index = i;
                break;
            }
        }

        if(startState !== -1 && startState !== null)
        {
            let body = {
                associatedFlow: parseInt(values.workflow),
                currentStates: [startState],
                initiater: user.data.id
            }

            authProvider.authPost(`/activity/execution/handle/`, body, config, false)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                // setExecution()
                toast({
                    position: 'top',
                    title: `Activity execution`,
                    description: `Successfuly started execution of activity ${workflows[index].title}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onNewExecution(body.associatedFlow, res.data)
            })
            .catch(error => {
                console.log(error);
                toast({
                    position: 'top',
                    title: `Activity execution`,
                    description: `Failed to start execution of activity ${workflows[index].title}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            })
        }
        else
        {
            toast({
                position: 'top',
                title: `Activity execution`,
                description: `Failed to start execution of activity ${workflows[index].title}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
    }

    const validationSchema = Yup.object({
        workflow: Yup.string()
            .required('Required'),
    })

    const initialValues = {
        approver: ''
    }

    return (
        <Formik
        initialValues={initialValues}
        onSubmit={onSubmitworkflow}
        validationSchema={validationSchema}>
        {formik => {
        return (
            <Form>
                <HStack>                                              
                    <FormikControl
                        control='comboBoxWorkflows'
                        placeholder='Select workflow to execute'
                        name='workflow'
                        color="orange.400"
                        approvers={workflows}
                    />
                    <Button 
                        type='submit' 
                        disabled={!formik.isValid}
                        width="half"
                        color="orange.400"
                    >
                        Run
                    </Button>
                </HStack>
            </Form>
            )
        }}            
        </Formik>
    )
}

export default Execution