import React from 'react'
import { Field } from 'formik'
import {
    FormControl,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/react'

function ChakraNumberInput({label, name, defaultValue, minValue, maxValue, required, allowMouseWheel, size, color, isDisabled, ...rest}) {

    return (
        <Field name={name}>
            {({field, form}) => {
                return (
                    <FormControl isRequired={required} isInvalid={form.errors[name] && form.touched[name]}>
                        <FormLabel htmlFor={name} color={color}>{label}</FormLabel>
                        <NumberInput id={name}{...rest} size={size} allowMouseWheel={allowMouseWheel} defaultValue={defaultValue} min={minValue} max={maxValue}
                        onChange={(valueAsNumber) => {
                                form.setFieldValue(field.name, parseInt(valueAsNumber))
                                // form.values.name = parseInt(valueAsNumber)
                        }}
                        >
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                )
            }}
        </Field>
    )
}

export default ChakraNumberInput