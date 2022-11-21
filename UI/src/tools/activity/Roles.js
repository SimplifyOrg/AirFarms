import React from 'react'
import { useContext, useState } from 'react'
import { useEffect } from 'react'
import { AuthProvider } from '../../utils/AuthProvider'
import WorkflowContext from '../../utils/WorkflowContext'
import FarmContext from '../../utils/FarmContext'
import Role from './Role'
import {
    List,
    ListItem,
    Button,
    useToast,
    Portal,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    HStack
} from '@chakra-ui/react'
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'

function Roles({saveWorkflow}) {

    const {workflow} = useContext(WorkflowContext)
    const {farm} = useContext(FarmContext)
    let initSet = new Set()
    let initialRoles = []
    const [roles, SetRoles] = useState(initialRoles)
    const toast = useToast()
    
    useEffect(() => {

        const currWorkflow = localStorage.getItem(workflow);
        const workflowObj = JSON.parse(currWorkflow)

        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        authProvider.authGet(`/activity/work-group/handle/?associatedFlow=${workflowObj.workflow.id}&&ordering=-id`, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            for(let i = 0; i <  res.data.length; ++i)
            {
                if(!initSet.has(res.data[i].id))
                {
                    initSet.add(res.data[i].id)
                    initialRoles.push(res.data[i])
                    SetRoles(initialRoles.slice())
                }
            }

        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })

    }, [])

    const addRoleLocal = (roleObj) => {

        // Get current workflow's JSON object
        let currWorkflow = JSON.parse(localStorage.getItem(workflow));

        // Add new role to the workflow
        if(roleObj != null)
        {
            currWorkflow.roles.push(roleObj)
            localStorage.setItem(workflow, JSON.stringify(currWorkflow));
            saveWorkflow();
        }
    }

    const onCreate = (values, onSubmitProps) => {
        const currWorkflow = localStorage.getItem(workflow);
        const workflowObj = JSON.parse(currWorkflow)
        if(workflowObj.workflow.id === '-1' || workflowObj.workflow.id === 'n1')
        {
            toast({
                position: 'top',
                title: 'Cannot add new groups!',
                description: "Please add more nodes to activity.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        else
        {
            const authProvider = AuthProvider()
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }

            const data = {
                associatedFlow: workflowObj.workflow.id,
                name: `${values.name}_${workflowObj.workflow.title}`,
                farm: farm.id
            }

            authProvider.authPost(`/activity/work-group/handle/`, data, config, false)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                if(!initSet.has(res.data.id))
                {
                    initSet.add(res.data.id)
                    initialRoles.push(res.data)
                    SetRoles(initialRoles.slice())
                    addRoleLocal(res.data)
                }
            })
            .catch(error => {
                toast({
                    position: 'top',
                    title: 'Failed to add new role!',
                    description: "Please add more nodes to activity or try again later.",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            })

            onSubmitProps.setSubmitting(false)
            onSubmitProps.resetForm()
        }
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Required'),
    })

    const initialValues = {
        name: ''
    }

    return (
        <List spacing={3}>
            {
                roles.length === 0? <p></p>: roles.map((role, idx) => {
                    
                    const name = (role.name).split('_')[0]
                    return(
                        <ListItem>
                            <Role role={role}/>
                        </ListItem>
                    )
                })
            }
            <ListItem>
                <Popover>
                    <PopoverTrigger>
                        <Button>Add role</Button>
                    </PopoverTrigger>
                    <Portal>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverHeader>New role</PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={onCreate}
                                validationSchema={validationSchema}>
                                {formik => {
                                // console.log(formik)
                                return (
                                    <Form>
                                        <HStack> 
                                            <FormikControl
                                                control='chakraInput'
                                                type='text'
                                                name='name'
                                                required
                                                color="orange.400"
                                                placeholder="Name of role..."
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
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
            </ListItem>
        </List>
    )
}

export default Roles