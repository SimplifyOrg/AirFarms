import React, {useContext} from 'react'
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { Button } from "@chakra-ui/button";
import FormikControl from '../FormikControl';
import {Link, useNavigate} from 'react-router-dom'
import {
    VStack,
    useToast
} from '@chakra-ui/react'
import {AuthProvider} from '../../utils/AuthProvider'
import UserContext from '../../utils/UserContext'
import WorkflowContext from '../../utils/WorkflowContext';
import FarmContext from '../../utils/FarmContext';

function NewWorkflow() {

    const { user } = useContext(UserContext);
    const { farm } = useContext(FarmContext);
    const { workflow, setWorkflow } = useContext(WorkflowContext);
    const toast = useToast()
    const navigate = useNavigate()

    // const date = new Date()
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth()+1;//January is 0!`
    let year = today.getFullYear();

    if(day<10){day='0'+day}
    if(month<10){month='0'+month}

    let dt = month+'/'+day+'/'+year;
    const [mm,dd,yyyy] = dt.split('/')

    let hour = today.getHours()
    let min = today.getMinutes()
    let sec = today.getSeconds()

    const time = hour+':'+min+':'+sec;
    const dateString = `${yyyy}-${mm}-${dd}T${time}.000Z`;
    // const dateString = date.getFullYear() + '-' + date.toLocaleDateString('en', { month: 'long' }) + '-' + date.toLocaleDateString('en', { date: 'long' }) + 'T' + date.getHours() + ':' + date.getMinutes()
    //const [dateString, timeString, wish] = useDate(date)
    // const day = date.toLocaleDateString('en', { weekday: 'long' });
    // const dateString = `${day}, ${date.getDate()} ${date.toLocaleDateString('en', { month: 'long' })}\n\n`;

    const initialValues = {
        title:'',
        farm: farm.id,
        owner: user.id
    }

    const onSubmit = (values, onSubmitProps) => {
        //Call login API
        const workflow = {
            title: values.name,
            farm : farm.id,
            owner: user.data.id
        };

        let workflowInit = {
            workflow: {
                id: "-1",
                title: values.name,
                farm: farm.id,
                owner: user.data.id,
                startState: -1,
                is_production: "false"
            }

        }

        toast({
            position: 'top',
            title: `Activity creation`,
            description: `Edit activity ${values.name} `,
            status: 'success',
            duration: 3000,
            isClosable: true,
          })

        // setWorkflow(JSON.stringify(workflowInit))
        setWorkflow('generate_new_hash_here')
        navigate('/workflow' , {
            state: {
              workflow: workflowInit,
            }
        })

        // let config = {
        //     headers: {
        //       'Content-Type': 'application/json'
        //     }
        //   }
        // const authProvider = AuthProvider()
        // authProvider.authPost(`/activity/workflow/handle/`, workflow, config, false)
        // .then(res =>{
        //     console.log(res);
        //     console.log(res.data);            
        //     onSubmitProps.resetForm()
        //     setWorkflow(JSON.stringify(res.data))
        //     navigate('/workflow')
        // })
        // .catch(error => {
        //     console.log(error);
        //     console.log(error.data);
        // })
        // onSubmitProps.setSubmitting(false)
        // onSubmitProps.resetForm()
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Required'),
    })

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
                            type='text'
                            label='Workflow Title'
                            name='name'
                            required
                            color="orange.400"
                            placeholder="Name of the workflow..."
                        />
                    </VStack>
                    
                    <br/>
                    <Button 
                        type='submit' 
                        disabled={!formik.isValid}
                        width="full"
                        color="orange.400"
                    >
                        Create
                    </Button>                
                </Form>
                )
            }}            
            </Formik>
    )
}

export default NewWorkflow
