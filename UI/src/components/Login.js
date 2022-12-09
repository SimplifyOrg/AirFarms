import React, {useContext, useCallback} from 'react'
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
import {AuthProvider} from '../utils/AuthProvider'
import UserContext from '../utils/UserContext'
// import { useCookies } from 'react-cookie';
// import { useDispatch } from 'react-redux';
// import { userAction } from '../storeActions';

export default function Login(props) {

    const history = useNavigate()
    const { user, setUser } = useContext(UserContext);
    const toast = useToast()
    
    const initialValues = {
        username:'',
        password: ''
    }

    // const dispatch = useDispatch()

    const onSubmitPhone = (values, onSubmitProps) => {
        //Call login API
        const user = {
            username: values.phone,
            phonenumber : "+919920656966",
            password: values.password
          };

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        const authProvider = AuthProvider()
        authProvider.authPost(`/account/token/`, user, config, true)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            // const profilePictureURL = `${res.data.picture}`
            const userData = {
                data : res.data.user,
                picture : res.data.profilepicture
            }
            setUser(userData)
            // setCookie('airfarms_access_token', res.data.access, { samesite : 'lax' });
            // setCookie('airfarms_refresh_token', res.data.refresh, { samesite : 'lax' });
            // document.cookie = `airfarms_access_token=${accessToken};airfarms_refresh_token=${refreshToken};path=/`;
            authProvider.login(res.data.access, res.data.refresh)
            sessionStorage.setItem("lastFetch", new Date());            
            
            // authProvider.login()
            history('/dashboard')
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
                title: 'Login ID or Password wrong!',
                description: "Please reload the page and try again.",
                status: 'error',
                duration: 3000,
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

    const USER_DOESNOT_EXIST = "Login ID seems to be invalid! Try using phonenumeber or email ID";
    const USER_FETCH_ERROR = "Failed to verify login ID! Try using phonenumeber or email ID"

    Yup.addMethod(Yup.mixed, 'validUser', function (message) {
        return this.test('validUser', message, function (value) {            
            const { path, createError } = this;
            return new Promise(async (resolve, reject) => {
                let config = {
                    headers: {
                    'Content-Type': 'application/json'
                    }
                }    
                const authProvider = AuthProvider()
                let validated = false;
                await authProvider.authGet(`/account/user/?email=${value}`, config, false)
                .then(res =>{
                    console.log(res);
                    if(res.data.length === 0)
                    {
                        // reject(createError({ path, message: message ?? USER_DOESNOT_EXIST }));
                        validated = false;
                    }
                    else
                    {
                        // resolve(true);
                        validated = true
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(createError({ path, message: message ?? USER_FETCH_ERROR }));
                    validated = false
                })

                if(!validated)
                {
                    await authProvider.authGet(`/account/user/?phonenumber=${value}`, config, false)
                    .then(res =>{
                        console.log(res);
                        if(res.data.length === 0)
                        {
                            // reject(createError({ path, message: message ?? USER_DOESNOT_EXIST }));
                            validated = false;
                        }
                        else
                        {
                            // resolve(true);
                            validated = true
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        reject(createError({ path, message: message ?? USER_FETCH_ERROR }));
                        validated = false;
                    })
                }

                if(!validated)
                {
                    reject(createError({ path, message: message ?? USER_DOESNOT_EXIST }));
                }
                else
                {
                    resolve(true);
                }

            })
        });
    });

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const handleShow = useCallback(
        (toggle) => {
            setShow(toggle)
        }, [])

    const [error, setError] = React.useState('')
    const [errorFlag, setErrorFlag] = React.useState(false)

    const validationSchemaPhone = Yup.object({
        phone: Yup.string()
            .required('Required')
            .validUser(),
        password: Yup.string()
            .required('Required')
    })
    

    return (        
            <Formik
            initialValues={initialValues}
            onSubmit={onSubmitPhone}
            validationSchema={validationSchemaPhone}>
            {formik => {
            return (
                <Form>
                    <VStack>                                               
                        <FormikControl
                            control='chakraInput'
                            type='tel'
                            label='User ID'
                            name='phone'
                            required
                            color="orange.400"
                            placeholder="Phone or Email"
                        />
                        <FormikControl
                            control='chakraInput'
                            type={show ? "text" : "password"}
                            label='Password'
                            name='password'
                            required
                            color="orange.400"
                            showPasswordButton
                            handleShow={handleShow}
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
                        Login
                    </Button>                
                    <Button 
                        type='reset'
                        width="full"
                        color="orange.400"
                        onClick={() => {formik.setFieldValue('phone', '');formik.setFieldValue('password', '')}}
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
