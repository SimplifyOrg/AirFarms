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
    Divider
} from '@chakra-ui/react'
import { AuthProvider } from '../../utils/AuthProvider'
import FarmContext from '../../utils/FarmContext'
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'

function RoleUsers({role, users}) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    let initialFarmUsers = []
    let initSet = new Set()
    const [farmUsers, SetFarmUsers] = useState(initialFarmUsers)
    const {farm} = useContext(FarmContext)
    
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
                                initialFarmUsers.push(res.data[j])
                            }                            
                        }
                        SetFarmUsers(initialFarmUsers.slice())
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
                if(!initSet.has(values.assignee))
                {
                    initSet.add(values.assignee)
                    initialFarmUsers.push(res.data)
                    SetFarmUsers(initialFarmUsers.slice())
                } 
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })        
        
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
    }

    const validationSchema = Yup.object({
        assignee: Yup.string()
            .required('Required'),
    })

    const initialValues = {
        approver: ''
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
                            users.length === 0? <p></p>: users.map((user, idx) => {
                                
                                return(
                                    <ListItem>
                                        <HStack>                                        
                                        <Avatar key={idx} name={user.first_name} />
                                        <Text>{user.first_name} {user.last_name}</Text>
                                        </HStack>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <Divider orientation='vertical'/>
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
                                    approvers={farmUsers}
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
                </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
        
        </>
    )
}

export default RoleUsers