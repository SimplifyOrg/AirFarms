import React, {useContext, useState, useCallback} from 'react'
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { HStack, Button, Box, useColorModeValue, VStack } from '@chakra-ui/react';
import UserContext from '../../utils/UserContext'
import WorkflowContext from '../../utils/WorkflowContext'
import NodeContext from '../../utils/NodeContext';
import Assignee from './Assignee';
import { AuthProvider } from '../../utils/AuthProvider';

function Work(props) {

    const { user } = useContext(UserContext);
    const { node } = useContext(NodeContext);
    const { workflow, setWorkflow } = useContext(WorkflowContext);
    const [workid, SetWorkid] = useState(0);
    let initialAssignee = []
    let notifierSet = new Set()
    let assigneeSet = new Set()
    const [assignees, SetAssignees] = useState(initialAssignee)

    const getWorkId = () => {
        SetWorkid(workid+1);
        return `${node.id}${workid}`;
    }

    const addAssignee = useCallback((role) => {
        
        if(!assigneeSet.has(role.id))
        {
            assigneeSet.add(role.id)
            initialAssignee.push(role)
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

    const sendNotification = async (ass, notif) => {
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        let notifierSet = new Set()
        for(let i = 0; i < ass.length; ++i)
        {
            
            await authProvider.authGet(`/account/user/?groups=${ass[i].id}`, config)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                for(let j = 0; j < res.data.length; ++j)
                {
                    notifierSet.add(res.data[j].id)
                }
                
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })
        }

        for(let i = 0; i < notif.length; ++i)
        {
            notifierSet.add(notif[i])
        }

        let arr = Array.from(notifierSet)

        for(let i = 0; i < arr.length; ++i)
        {
            const body = {
                sender: user.data.id,
                receiver: arr[i],
                notification_type: '2'
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
    }

    const onSubmit = async (values, onSubmitProps) => {
        
        let ass = []
        let notoif = [];
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        for(let i = 0; i < assignees.length; ++i)
        {
            ass.push(assignees[i]);
            await authProvider.authGet(`/account/user/?groups=${assignees[i].id}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);

                if (!notifierSet.has(user.data.id)) {
                    notifierSet.add(user.data.id);
                    notoif.push(user.data.id);
                }
                for (let j = 0; j < res.data.length; ++j) 
                {
                    if (!notifierSet.has(res.data[j].id)) {
                        notifierSet.add(res.data[j].id);
                        notoif.push(res.data[j].id);
                    }
                }
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            });
        }

        const work = {
            id: `temp_${getWorkId()}`,
            title: values.title,
            assignee: ass,
            notifiers: notoif,
            notes: values.notes,
            associatedState: node?.id,
            duration: `${values.days > 9 ? values.days : '0' + values.days}:${values.hours > 9 ? values.hours : '0' + values.hours}:${values.minutes > 9 ? values.minutes : '0' + values.minutes}:00`
        }

        sendNotification(ass, notoif)

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
        title: Yup.string()
            .required('Required'),
    })

    const initialValues = {
        title: props.initial? props.initial.title:'',
        notes: props.initial? props.initial.notes:'',
        days: 5,
        hours: 0,
        minutes: 0,
        seconds: 0
    }

  return (
        <Box bg={useColorModeValue('whiteAlpha.700','gray.700')} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <Assignee addAssigneeInWork={addAssignee}/>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                {formik => {
                console.log(formik)
                return (
                    <Form>
                        <VStack>
                            <HStack> 
                                <FormikControl
                                    control='chakraInput'
                                    type='text'
                                    label='Title'
                                    name='title'
                                    required
                                    color="orange.400"
                                    placeholder="Title"
                                />
                                <FormikControl
                                    control='chakraTextArea'
                                    type='text'
                                    label='Notes'
                                    name='notes'
                                    required
                                    color="orange.400"
                                    placeholder="Describe the work..."
                                />
                            </HStack>
                            <HStack>
                                <FormikControl
                                    control='chakraNumberInput'
                                    label='Days'
                                    name='days'
                                    color="orange.400"
                                    size='sm'
                                    allowMouseWheel
                                    defaultValue={5}
                                    minValue={0}
                                    maxValue={29}
                                />
                                <FormikControl
                                    control='chakraNumberInput'
                                    label='Hours'
                                    name='hours'
                                    color="orange.400"
                                    size='sm'
                                    allowMouseWheel
                                    defaultValue={0}
                                    minValue={0}
                                    maxValue={23}
                                />
                                <FormikControl
                                    control='chakraNumberInput'
                                    label='Minutes'
                                    name='minutes'
                                    color="orange.400"
                                    size='sm'
                                    allowMouseWheel
                                    defaultValue={0}
                                    minValue={0}
                                    maxValue={59}
                                />  

                            </HStack>
                        </VStack>
                        <Button 
                            type='submit' 
                            disabled={!formik.isValid}
                            width="half"
                            color="orange.400"
                        >
                            Create
                        </Button>
                    </Form>
                )
            }}            
            </Formik>
        </Box>
  )
}

export default Work