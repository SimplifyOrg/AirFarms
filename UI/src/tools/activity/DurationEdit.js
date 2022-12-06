import React from 'react'
import { AuthProvider } from '../../utils/AuthProvider'
import { HiCheck } from "react-icons/hi2";
import { IconButton } from '@chakra-ui/react';
import FormikControl from '../../components/FormikControl';
import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import {VStack} from '@chakra-ui/react'

function DurationEdit({onChange, work}) {

    const initialDuration = work.duration.split(':')
    
    const onSubmit = async (values, onSubmitProps) => {
        
        if(work)
        {
            const authProvider = AuthProvider()
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }

            let workData = work;
            workData.duration = `${values.days > 9 ? values.days : '0' + values.days}:${values.hours > 9 ? values.hours : '0' + values.hours}:${values.minutes > 9 ? values.minutes : '0' + values.minutes}:00`
            onChange(workData)
        }

        // Clear the form fields
        onSubmitProps.setSubmitting(false)
    }
    
    //Schema to validate data in fields of the form
    const validationSchema = Yup.object({

    })

    const initialValues = {
        days: parseInt(initialDuration[0]),
        hours: parseInt(initialDuration[1]),
        minutes: parseInt(initialDuration[2]),
        seconds: parseInt(initialDuration[3])
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
                            control='chakraNumberInput'
                            label='Days'
                            name='days'
                            color="orange.400"
                            size='sm'
                            allowMouseWheel
                            defaultValue={initialValues.days}
                            minValue={0}
                            maxValue={29}
                        />
                        <FormikControl
                            control='chakraNumberInput'
                            label='Hours'
                            name='hours'
                            color="orange.400"
                            size='sm'
                            allowMouseWheel
                            defaultValue={initialValues.hours}
                            minValue={0}
                            maxValue={23}
                        />
                        <FormikControl
                            control='chakraNumberInput'
                            label='Minutes'
                            name='minutes'
                            color="orange.400"
                            size='sm'
                            allowMouseWheel
                            defaultValue={initialValues.minutes}
                            minValue={0}
                            maxValue={59}
                        />

                        <IconButton 
                            type='submit' 
                            disabled={!formik.isValid}
                            width="half"
                            color="orange.400"
                            icon={<HiCheck/>}
                        />
                    </VStack>
                    
                </Form>
            )
        }}            
        </Formik>
    )
}

export default DurationEdit