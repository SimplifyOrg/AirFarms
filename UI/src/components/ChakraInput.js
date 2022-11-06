import React from 'react'
import {
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    IconButton,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Field } from 'formik'

function ChakraInput(props) {
    const {label, name, required, color, setRef, type, handleShow, showPasswordButton, ...rest} = props
    return (
        <Field name={name}>
            {({field, form}) => {
                return (
                    <FormControl isRequired={required} isInvalid={form.errors[name] && form.touched[name]}>
                        {label ? <FormLabel htmlFor={name} color={color}>{label}</FormLabel> : <div/>}
                        <InputGroup>
                            <Input id={name}{...rest}{...field} type={type}
                            ref={(ref) => {
                                if(setRef !== undefined && ref !== null){
                                    setRef(ref)
                                    }
                                }
                            }/>
                            {showPasswordButton? <InputRightElement children={type === 'password' ? <IconButton variant='ghost' onClick={()=>handleShow(true)} colorScheme='blue' aria-label='Search database'  icon={<ViewIcon />}/> : <IconButton variant='ghost' onClick={()=>handleShow(false)} colorScheme='blue' aria-label='Search database'  icon={<ViewOffIcon />}/>} /> : <></>}
                        </InputGroup>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                )
            }}
        </Field>
    )
}

export default ChakraInput
