import React from 'react'
import {
    Checkbox,
    FormControl,
    FormLabel,
    FormErrorMessage
} from '@chakra-ui/react'
import { Field } from 'formik'

function ChakraCheckbox(props) {
    const {label, name, color,...rest} = props
    return (
        <Field name={name}>
            {({field, form}) => {
                return (
                    <FormControl isInvalid={form.errors[name] && form.touched[name]}>
                        <FormLabel htmlFor={name} color={color}>{label}</FormLabel>
                        <Checkbox id={name} onChange={field.onChange}{...rest}{...field}>{label}</Checkbox>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                )
            }}
        </Field>
    )
}

export default ChakraCheckbox
