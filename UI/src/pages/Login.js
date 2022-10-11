import React, {useContext} from 'react'
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { Button } from "@chakra-ui/button";
import FormikControl from '../components/FormikControl';
import { useNavigate } from 'react-router-dom';
import {
    HStack,
    VStack
} from '@chakra-ui/react'
import {AuthProvider} from '../utils/AuthProvider'
import UserContext from '../utils/UserContext'
import { useCookies } from 'react-cookie';
// import { useDispatch } from 'react-redux';
// import { userAction } from '../storeActions';

export default function Login(props) {

    const history = useNavigate()
    const { user, setUser } = useContext(UserContext);
    const [cookies, setCookie] = useCookies(['airfarms']);
    
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
            setCookie('airfarms_access_token', res.data.access, { samesite : 'lax' });
            setCookie('airfarms_refresh_token', res.data.refresh, { samesite : 'lax' });
            authProvider.login(res.data.access, res.data.refresh)
            
            
            // authProvider.login()
            history('/farms')
            // setErrorFlag(false)
            // setError('')
            onSubmitProps.resetForm()
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
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

    const validationSchemaPhone = Yup.object({
        phone: Yup.string()
            .required('Required'),
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
