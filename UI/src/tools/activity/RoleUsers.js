import React, {useEffect, useContext, useState} from 'react'
import {
    List,
    ListItem,
    Avatar,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    Button,
    HStack,
    Text,
    Divider,
    useToast
} from '@chakra-ui/react'
import { AuthProvider } from '../../utils/AuthProvider'
import FarmContext from '../../utils/FarmContext'
import ExecutionContext from '../../utils/ExecutionContext'
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'

function RoleUsers({role}) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [farmUsers, SetFarmUsers] = useState(new Map())
    const addFarmUsersInMap = (key, value) => {
        SetFarmUsers(new Map(farmUsers.set(key, value)))
    }

    const [assignedUsers, SetAssignedUsers] = useState(new Map())
    const addAssignedUsersInMap = (key, value) => {
        SetAssignedUsers(new Map(assignedUsers.set(key, value)))
    }
    const {farm} = useContext(FarmContext)
    const {execution} = useContext(ExecutionContext)
    const toast = useToast()

    useEffect(() => {

        // const currWorkflow = localStorage.getItem(workflow);
        // const workflowObj = JSON.parse(currWorkflow)

        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        authProvider.authGet(`/account/user/?groups=${role.id}&&ordering=-id`, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            for(let i = 0; i <  res.data.length; ++i)
            {
                // Add assigned users to the state list
                addAssignedUsersInMap(res.data[i].id, res.data[i])
            }

        })
        .catch(error => {
            console.log(error);
        })

    }, [])
    
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
                    let farmName = farm.name.toLowerCase() +'_'+farm.description.toLowerCase()+'_group'
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
                                addFarmUsersInMap(res.data[j].id, res.data[j])                          
                            }
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

    const onSubmitFarmUser = (values, onSubmitProps) => {        
        
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        if(!assignedUsers.has(values.assignee))
        {
            authProvider.authGet(`/account/user/?id=${values.assignee}`, config)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                const body = res.data[0]
                body.groups.push(role.id)
        
                authProvider.authPatch(`/account/user/${values.assignee}/`, body, config)
                .then(res =>{
                    console.log(res);
                    console.log(res.data);
                    addAssignedUsersInMap(values.assignee, res.data) 
                })
                .catch(error => {
                    console.log(error);
                })
            })
            .catch(error => {
                console.log(error);
            })
        }
        else
        {
            toast({
                position: 'top',
                title: 'User already assigned!',
                description: "Cannot add same user again.",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        }
        
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
    }

    const validationSchema = Yup.object({
        assignee: Yup.string()
            .required('Required'),
    })

    const initialValues = {
        assignee: ''
    }

    return (
        <>
        <Button onClick={onOpen}>{(role.name).split('_')[0]}</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{(role.name).split('_')[0]}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <HStack>
                    <List spacing={3}>
                        {
                            assignedUsers.size === 0? <p></p>: [...assignedUsers].map((user, idx) => {
                                
                                return(
                                    <ListItem>
                                        <HStack>                                        
                                        <Avatar key={idx} name={user[1].first_name} />
                                        <Text>{user[1].first_name} {user[1].last_name}</Text>
                                        </HStack>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    {execution !== null? <></>:<><Divider orientation='vertical'/>
                    <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmitFarmUser}
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
                                    approvers={Array.from(farmUsers.values())}
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
                </Formik></>}
                </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
        
        </>
    )
}

export default RoleUsers