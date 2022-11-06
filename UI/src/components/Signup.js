import React from 'react'
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { Button } from "@chakra-ui/button";
import FormikControl from './FormikControl';
import { useNavigate } from 'react-router-dom';
import {
    HStack,
    VStack,
    useToast
} from '@chakra-ui/react'
import { AuthProvider } from '../utils/AuthProvider';

function Signup() {

    const toast = useToast()
    const navigate = useNavigate()
    
    const initialValues = {
        name:'',
        email:'',
        phone: '',
        password: '',
        confirmPassword: '',
        about: '',
        location: '',
        birthDate: ''
    }

    const onSubmit = (values, onSubmitProps) => {
        let date = new Date(values.birthDate)
        let dateSting = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        //Call register API
        const user = {
            username: values.email,
            first_name: values.name,
            last_name: "",
            phonenumber: values.phone,
            email: values.email,
            about: values.about,
            location: values.location,
            birth_date: dateSting,
            password: values.password
          };

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }

        const authProvider = AuthProvider()
        authProvider.authPost(`/account/user/`, user, config, true)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            // const profilePictureURL = `${res.data.picture}`
            // const userData = {
            //     data : res.data.user,
            //     picture : res.data.profilepicture
            // }
            // setUser(userData)
            // // setCookie('airfarms_access_token', res.data.access, { samesite : 'lax' });
            // // setCookie('airfarms_refresh_token', res.data.refresh, { samesite : 'lax' });
            // // document.cookie = `airfarms_access_token=${accessToken};airfarms_refresh_token=${refreshToken};path=/`;
            // authProvider.login(res.data.access, res.data.refresh)
            // sessionStorage.setItem("lastFetch", new Date());            
            
            // authProvider.login()
            navigate('/login')
            // setErrorFlag(false)
            // setError('')
            onSubmitProps.resetForm()
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
            // onSubmitProps.setFieldError("password", "Login failed! Please reload the page and try again.")
            toast({
                position: 'top',
                title: 'Signup failed!',
                description: "Please reload the page and try again.",
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
            onSubmitProps.setSubmitting(false)
            // setSubmitting(false)
            // dispatch(userAction('{}'));
            // setErrorFlag(true)
            // setError(error)
        })
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
    }

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const [error, setError] = React.useState('')
    const [errorFlag, setErrorFlag] = React.useState(false)

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string()
            .email('Invalid email ID')
            .required('Required'),
        phone: Yup.string()
            .required('Required'),
        password: Yup.string()
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), ''], 'Passwords must match')
            .required('Required'),
        birthDate: Yup.date().required('Required')
    })

    return (
        <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
        {formik => {
        // console.log('Formik object', formik)
        return (
            <Form>
                <VStack>
                    <HStack>
                        <FormikControl
                            control='chakraInput'
                            type='email'
                            label='Email'
                            name='email'
                            required
                            color="orange.400"
                        />                       
                        <FormikControl
                            control='chakraInput'
                            type='tel'
                            label='Phone number'
                            name='phone'
                            required
                            color="orange.400"
                        />
                    </HStack>
                    <HStack>                        
                        <FormikControl
                            control='chakraInput'
                            type='text'
                            label='Address'
                            name='location'
                            required
                            color="orange.400"
                        />
                        <FormikControl
                            control='chakraInput'
                            type='text'
                            label='Pin Code'
                            name='pin'
                            required
                            color="orange.400"
                        />                        
                    </HStack>
                </VStack>
                <FormikControl
                    control='chakraTextArea'
                    type='text'
                    label='About'
                    name='about'
                    color="orange.400"
                />
                <FormikControl
                    control='chakraInput'
                    type='text'
                    label='Name'
                    name='name'
                    required
                    color="orange.400"
                />
                <FormikControl
                    control='chakraDatePicker'
                    type='text'
                    label='Birth Date'
                    name='birthDate'
                    required
                    color="orange.400"
                />
                <FormikControl
                    control='chakraInput'
                    type={show ? "text" : "password"}
                    label='Password'
                    name='password'
                    required
                    color="orange.400"
                />
                <FormikControl
                    control='chakraInput'
                    type='password'
                    label='Confirm Password'
                    name='confirmPassword'
                    required
                    color="orange.400"
                />
                <br/>
                <HStack>
                    <Button 
                        type='submit' 
                        disabled={!formik.isValid}
                        width="full"
                        color="orange.400"
                    >
                        Submit
                    </Button>                
                    <Button 
                        type='reset'
                        width="full"
                        color="orange.400"
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

export default Signup
