import React from 'react'
import DatePicker from './DatePicker'
import Input from './Input'
import Select from './Select'
import Textarea from './Textarea'

function FormikControl(props) {
    const { control, ...rest } = props

    switch(control) {
        case 'input': 
            return <Input {...rest} />
        case 'date':
            return <DatePicker {...rest} />
        case 'select':
            return <Select {...rest}/>
        case 'textarea':
            return <Textarea {...rest}/>
        default: 
            return null
    }

}

export default FormikControl