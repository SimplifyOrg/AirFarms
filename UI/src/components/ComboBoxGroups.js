import React from 'react'
import { Field } from 'formik'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Select
} from '@chakra-ui/react'

function ComboBoxGroups(props) {
    const {label, name, color, placeholder, approvers, value, ...rest} = props
    return (
        <Field>
            {({ field, form }) => (
            <FormControl name={name} >
                <Select
                name={name}
                onChange={field.onChange} // or {form.handleChange}
                // value={value}
                placeholder={placeholder}
                id={name}
                {...rest}>
                 {/* {...field}> */}
                    {
                        approvers.length === 0 ? <></>: approvers.map((approver, idx) => {
                        return(
                            <option key={idx} value={approver.id}>{(approver.name).split('_')[0]}</option>
                        )
                        })
                    }
                </Select>
                <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
            </FormControl>
            )}
        </Field>
    )
}

export default ComboBoxGroups
