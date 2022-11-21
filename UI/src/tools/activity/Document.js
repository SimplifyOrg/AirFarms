import React, {useContext, useState, useCallback} from 'react'
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import { HStack, Button, Box, useColorModeValue } from '@chakra-ui/react';
import UserContext from '../../utils/UserContext'
import { AuthProvider } from '../../utils/AuthProvider';

function Document({work, updateDocList, onFileChange}) {

    const { user } = useContext(UserContext);
    
    //Schema to validate data in fields of the form
    const validationSchema = Yup.object({
        title: Yup.string().required('Required'),
    })

    const initialValues = {
        title: '',
    }

    return (
        <Box bg={useColorModeValue('whiteAlpha.700','gray.700')} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <Formik
                initialValues={initialValues}
                onSubmit={updateDocList}
                validationSchema={validationSchema}>
                {formik => {
                console.log(formik)
                return (
                    <Form>
                        <HStack> 
                            <FormikControl
                                control='chakraInput'
                                type='text'
                                label='Title'
                                name='title'
                                required
                                color="orange.400"
                            />                                        
                            <FormikControl
                                control='chakraInput'
                                type='file'
                                label='Upload Document'
                                name='document'
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
        </Box>
    )
}

export default Document