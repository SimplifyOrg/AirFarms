import React from 'react'
import { Field } from 'formik'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Textarea,
    useColorModeValue
} from '@chakra-ui/react'

function ChakraTextArea(props) {
    const {label, name, color,...rest} = props
    const fontColor = useColorModeValue('yellow.200', 'yellow.100');
    return (
        <Field name={name}>
            {({field, form}) => {
                return (
                    <FormControl isInvalid={form.errors[name] && form.touched[name]}>
                        <FormLabel htmlFor={name} color={color}>{label}</FormLabel>
                        <Textarea id={name}{...rest}{...field} color={fontColor}/>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                )
            }}
        </Field>
    )
}

export default ChakraTextArea
