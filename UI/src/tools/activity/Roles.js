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
import {useNavigate} from 'react-router-dom'
import ExecutionContext from '../../utils/ExecutionContext'

function Roles({saveWorkflow}) {

    const navigate = useNavigate()
    const {workflow} = useContext(WorkflowContext)
    const {farm} = useContext(FarmContext)
    const {execution} = useContext(ExecutionContext)
    const [roles, SetRoles] = useState(new Map())
    const addRoleInMap = (key, value) => {
        SetRoles(new Map(roles.set(key, value)))
    }
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
                addRoleInMap(res.data[i].id, res.data[i])
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
                if(!roles.has(res.data.id))
                {
                    addRoleInMap(res.data.id, res.data)
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
                roles.size === 0? <p></p>: [...roles].map((role, idx) => {
                    
                    const name = (role[1].name).split('_')[0]
                    return(
                        <ListItem>
                            <Role role={role[1]}/>
                        </ListItem>
                    )
                })
            }
            {execution !== null?<></>:<ListItem>
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
            </ListItem>}
        </List>
    )
}

export default Roles