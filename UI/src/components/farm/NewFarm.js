import React, {useContext} from 'react'
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { Button } from "@chakra-ui/button";
import FormikControl from '../FormikControl';
import { useHistory } from "react-router-dom";
import {
    VStack,
    useToast
} from '@chakra-ui/react'
import {AuthProvider} from '../../utils/AuthProvider'
import UserContext from '../../utils/UserContext'

function NewFarm(props) {

    const { user } = useContext(UserContext);
    const toast = useToast()

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
        name:'',
        description: '',
        user: user.id,
        date_created: dateString
    }

    const onSubmit = (values, onSubmitProps) => {
        //Call login API
        const farm = {
            name: values.name,
            description : values.description,
            user : user.data.id,
            date_created: dateString
        };

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        const authProvider = AuthProvider()
        authProvider.authGet(`/farm/perform/manage/?name=${farm.name}&&user=${farm.user}&&archived=${false}`, config)
        .then(resGet => {
            if(resGet.data.length === 0)
            {
                authProvider.authPost(`/farm/perform/manage/`, farm, config, false)
                .then(res =>{
                    console.log(res);
                    console.log(res.data);
                    toast({
                        position: 'top',
                        title: `${res.data.name} farm created`,
                        description: `You can create workflows now.`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    })
                    const farmPictureURL = `/farm/perform/manage/farmpicture/`
                    const farmPicture = {
                        farm: res.data.id,
                        description: res.data.description
                    }
                    authProvider.authPost(farmPictureURL, farmPicture, config, false)
                    .then( resPic =>{
                        console.log(resPic);
                        console.log(resPic.data);
                        // dispatch(farmAction(res.data));
                        // history.push('/create-farm')
                        props.updateFarmList(res.data)
                    })
                    .catch(error =>{
                        console.log(error);
                        console.log(error.data);
                    })

                    // const discussionBoardFarm = {
                    //     farm: res.data.id
                    // }

                    // //Create farm discussion board
                    // authProvider.authPost("/farm/perform/farm/discussionboard/", discussionBoardFarm, config, false)
                    // .then( resFarm =>{
                    //     console.log(resFarm);
                    //     console.log(resFarm.data);
                    // })
                    // .catch(error =>{
                    //     console.log(error);
                    //     console.log(error.data);
                    // })
                    
                    onSubmitProps.resetForm()
                })
                .catch(error => {
                    console.log(error);
                    console.log(error.data);
                    toast({
                        position: 'top',
                        title: `Farm creation failed!`,
                        description: `Please try again`,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    })
                })
            }
            else
            {
                toast({
                    position: 'top',
                    title: `Farm creation failed!`,
                    description: `Name already taken, please use a different name`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        })
        .catch(errorGet =>{
            console.log(errorGet);
            console.log(errorGet.data);
        })
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Required'),
        description: Yup.string()
            .required('Required')
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
                            label='Farm Name'
                            name='name'
                            required
                            color="orange.400"
                            placeholder="Your farm's name"
                        />
                        <FormikControl
                            control='chakraTextArea'
                            type='text'
                            label='Farm Description'
                            name='description'
                            required
                            color="orange.400"
                            placeholder="Describe your farm"
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

export default NewFarm
