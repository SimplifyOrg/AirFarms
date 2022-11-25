import React, {useContext, useState, useCallback} from 'react'
import FormikControl from '../FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { HStack, Button, Box, useColorModeValue, VStack, Image } from '@chakra-ui/react';
import UserContext from '../../utils/UserContext'
import { AuthProvider } from '../../utils/AuthProvider';

function UpdatePicture({updatePicture}) {

    const { user } = useContext(UserContext);
    const [file, SetFile] = useState(null)

    const onFileChange = useCallback((event) => {     
        // Update the state
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (readerEvent) => {
            SetFile(readerEvent.target.result);
          };      
      }, [])
    
    const uploadPicture = useCallback((values, onSubmitProps) => {

        let configOut = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()

        authProvider.authGet(`/account/profilepicture/?user=${user.data.id}`, configOut)
        .then(res => {
            console.log(res);
            console.log(res.data);
            const formData = new FormData();

            formData.append('user', user.data.id)
            formData.append('image', values.files[0])

            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            authProvider.authPut(`/account/profilepicture/${res.data[0].id}/`, formData, config)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                SetFile(res.data.image)
                // Update docList
                updatePicture(res.data)

            })
            .catch(errorRes => {
                console.log(errorRes);
            })
        })
        .catch(error => {
            console.log(error);
        })

        
        
    }, []);
    
    //Schema to validate data in fields of the form
    const validationSchema = Yup.object({
    })

    const initialValues = {
        document: '',
    }

    return (
        <Box display='flex' bg={useColorModeValue('whiteAlpha.700','gray.700')} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <VStack>
            {file === null?<></>:<Image
                boxSize='50px'
                objectFit='cover'
                src={file}
                alt={'Picture'}
            />}
            <Formik
                initialValues={initialValues}
                onSubmit={uploadPicture}
                validationSchema={validationSchema}>
                {formik => {
                console.log(formik)
                return (
                    <Form>
                        <HStack>                                
                            <FormikControl
                                control='chakraInput'
                                type='file'
                                label='Upload Picture'
                                name='picture'
                                required
                                color="orange.400"
                                handleFileUpload={onFileChange}
                            />
                            <Button 
                                type='submit' 
                                disabled={!formik.isValid}
                                width="half"
                                color="orange.400"
                            >
                                Upload
                            </Button>
                        </HStack>
                    </Form>
                )
            }}            
            </Formik>
            </VStack>
        </Box>
    )
}

export default UpdatePicture