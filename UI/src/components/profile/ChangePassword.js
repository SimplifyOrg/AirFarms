import React, {useContext, useState, useCallback} from 'react'
import { AuthProvider } from '../../utils/AuthProvider';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { Button } from "@chakra-ui/button";
import FormikControl from '../FormikControl';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../utils/UserContext';
import {
    useToast,
    VStack,
    HStack
} from '@chakra-ui/react'

function ChangePassword() {

    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext);
    const toast = useToast()

    const [show, setShow] = useState(false)
    const handleShow = useCallback((toggle) => {
            setShow(toggle)
        }, [])
    
    const initialValues = {
        old_password:'',
        new_password: '',
        confirmPassword: ''
    }

    const validationSchema = Yup.object({
        old_password: Yup.string()
            .required('Required'),
        new_password: Yup.string()
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('new_password'), ''], 'Passwords must match')
            .required('Required'),
    })

    const onSubmit = (values, onSubmitProps) => {
        const data = {
            old_password: values.old_password,
            new_password : values.new_password,
          };

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        const authProvider = AuthProvider()
        authProvider.authPatch(`/account/user/${user.data.id}/`, data, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            toast({
                position: 'top',
                title: 'Success!',
                description: "Password changed, please login again.",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
            onSubmitProps.resetForm()
            navigate('/logout')
            
        })
        .catch(error => {
            console.log(error);
            toast({
                position: 'top',
                title: 'Password change failed!',
                description: "You do not have rights to change the password",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            onSubmitProps.setSubmitting(false)
        })
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}>
            {formik => {
            return (
                <Form>
                    <VStack>                                               
                    <FormikControl
                            control='chakraInput'
                            type={show ? "text" : "password"}
                            label='Old Password'
                            name='old_password'
                            required
                            color="orange.400"
                            showPasswordButton
                            handleShow={handleShow}
                            showColor="gray.500"
                            showIconColor="gray.500"
                        />
                        <FormikControl
                            control='chakraInput'
                            type={show ? "text" : "password"}
                            label='New Password'
                            name='new_password'
                            required
                            color="orange.400"
                            showPasswordButton
                            handleShow={handleShow}
                            showColor="gray.500"
                            showIconColor="gray.500"
                        />
                        <FormikControl
                            control='chakraInput'
                            type="password"
                            label='Confirm Password'
                            name='confirmPassword'
                            required
                            color="orange.400"
                            showColor="gray.500"
                            showIconColor="gray.500"
                        />
                    </VStack>
                    
                    <br/>
                    <HStack>
                    <Button 
                        type='submit' 
                        disabled={!formik.isValid}
                        width="full"
                        color="orange.400"
                    >
                        Update
                    </Button>                
                    <Button 
                        type='reset'
                        width="full"
                        color="orange.400"
                        onClick={() => {formik.setFieldValue('old_password', '');formik.setFieldValue('new_password', '');formik.setFieldValue('confirmPassword', '')}}
                    >
                        Reset
                    </Button>
                    </HStack>
                </Form>
                )
            }}            
            </Formik>        
    )
}

export default ChangePassword