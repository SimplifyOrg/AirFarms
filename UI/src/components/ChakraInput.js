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
    const {label, name, required, color, setRef, type, handleShow, showPasswordButton, showColor, showIconColor, handleFileUpload, ...rest} = props
    return (
        <Field name={name}>
            {({field, form}) => {
                return (
                    <FormControl isRequired={required} isInvalid={form.errors[name] && form.touched[name]}>
                        {label ? <FormLabel htmlFor={name} color={color}>{label}</FormLabel> : <div/>}
                        <InputGroup>
                        {type === 'file'?
                            <Input id={name}{...rest}{...field} type={type}
                            ref={(ref) => {
                                if(setRef !== undefined && ref !== null){
                                    setRef(ref)
                                    }
                                }
                            }
                            onChange={(event) => {
                                if(handleFileUpload !== null && handleFileUpload !== undefined)
                                {
                                    handleFileUpload(event)
                                }                            
                            }}
                            />:
                            <Input id={name}{...rest}{...field} type={type}
                            ref={(ref) => {
                                if(setRef !== undefined && ref !== null){
                                    setRef(ref)
                                    }
                                }
                            }
                            />
                        }
                            {showPasswordButton? <InputRightElement children={type === 'password' ? <IconButton colorScheme={showColor} variant='ghost' onClick={()=>handleShow(true)} icon={<ViewIcon color={showIconColor}/>}/> : <IconButton colorScheme={showColor} variant='ghost' onClick={()=>handleShow(false)} icon={<ViewOffIcon color={showIconColor}/>}/>} /> : <></>}
                        </InputGroup>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                )
            }}
        </Field>
    )
}

export default ChakraInput
