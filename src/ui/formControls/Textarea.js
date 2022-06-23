import React from 'react'
import { Field, ErrorMessage} from 'formik'
import TextError from './TextError'

function Textarea(props) {
    const { label, name, ...rest} = props
    return (
        <div className='formControl'>
            <label htmlFor={name}>{label}</label>
            <Field className='areaField' as='textarea' id={name} name={name} {...rest}/>
            <ErrorMessage name={name} component={TextError}/>
        </div>
    )
}

export default Textarea