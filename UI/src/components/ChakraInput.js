import React from 'react'
import {
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage
} from '@chakra-ui/react'
import { Field } from 'formik'

function ChakraInput(props) {
    const {label, name, required, color, setRef, ...rest} = props
    return (
        <Field name={name}>
            {({field, form}) => {
                return (
                    <FormControl isRequired={required} isInvalid={form.errors[name] && form.touched[name]}>
                        {label ? <FormLabel htmlFor={name} color={color}>{label}</FormLabel> : <div/>}
                        <Input id={name}{...rest}{...field}
                        ref={(ref) => {
                            if(setRef !== undefined && ref !== null){
                                setRef(ref)
                                }
                            }
                        }/>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                )
            }}
        </Field>
    )
}

export default ChakraInput
