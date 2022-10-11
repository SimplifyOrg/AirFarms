import React from 'react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    useColorMode
} from '@chakra-ui/react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import './css/date-picker.css'; 
import { Field } from 'formik'


function ChakraDatePicker(props) {
    const {label, name, required, color, dateFormat, ...rest} = props
    const isLight = useColorMode().colorMode==='light';//you can check what theme you are using right now however you want
    return (
        <Field name={name}>
            {({field, form}) => {
                const {setFieldValue} = form
                const {value} = field
                return (
                    <FormControl isRequired={required} isInvalid={form.errors[name] && form.touched[name]}>
                        <FormLabel htmlFor={name} color={color}>{label}</FormLabel>                        
                        <div className={isLight?"light-theme":"dark-theme"}>
                            <ReactDatePicker
                                id={name}
                                {...field}
                                {...rest}
                                selected={(value && new Date(value)) || null}
                                dateFormat={dateFormat !== undefined ? dateFormat: "PP"}
                                onChange={val => setFieldValue(name, val)}
                                className="react-datapicker__input-text"
                                showPopperArrow={true}
                                isClearable={true}
                                showYearDropdown
                            />
                        </div>                            
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                )
            }}
        </Field>
    )
}

export default ChakraDatePicker
