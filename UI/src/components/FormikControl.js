import React from 'react'
//import Input from './Input'
//import Textarea from './Textarea'
//import Select from './Select'
//import RadioButtons from './RadioButtons'
//import CheckboxGroup from './CheckboxGroup'
import ChakraDatePicker from './ChakraDatePicker'
import ChakraInput from './ChakraInput'
import ChakraTextArea from './ChakraTextArea'
import ComboBox from './ComboBox'
import ComboBoxGroups from './ComboBoxGroups'
import ComboBoxWorkflows from './ComboBoxWorkflows'
import ChakraCheckbox from './ChakraCheckbox'
import ChakraNumberInput from './ChakraNumberInput'
// import WysiwygEditor from './WysiwygEditor'

function FormikControl (props) {
  const { control, ...rest } = props
  switch (control) {
    case 'chakraInput':
      return <ChakraInput {...rest} />
    case 'chakraTextArea':
        return <ChakraTextArea {...rest} />
    // case 'wysiwygEditor':
    //     return <WysiwygEditor {...rest} />
    case 'chakraDatePicker':
        return <ChakraDatePicker {...rest} />
    case 'comboBox':
        return <ComboBox {...rest} />
    case 'comboBoxGroups':
        return <ComboBoxGroups {...rest} />
    case 'comboBoxWorkflows':
        return <ComboBoxWorkflows {...rest} />
    case 'chakraCheckbox':
        return <ChakraCheckbox {...rest} />
    case 'chakraNumberInput':
        return <ChakraNumberInput {...rest} />
    default:
      return null
  }
}

export default FormikControl