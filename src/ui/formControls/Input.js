import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

function Input(props) {
    const { label, name, ...rest } = props
    return (
        <div className='formControl'>
            <label htmlFor={name}>{label}</label>
            <Field className='field' id={name} name={name} {...rest}></Field>
            <ErrorMessage name={name} component={TextError}/>
        </div>
    )
}

export default Input