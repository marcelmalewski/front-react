import React from 'react'
import { Field, ErrorMessage} from 'formik'
import TextError from './TextError'

function Select(props) {
    const { label, name, options, ...rest} = props

    return (
        <div className='formControl'>
            <label htmlFor={name}>{label}</label>
            <Field as='select' className='field' id={name} name={name} {...rest}>
                {
                    options.map(option => {
                        return(
                            <option key={option.key} value={option.value}>
                                {option.key}
                            </option>
                        )
                    })
                }
            </Field>
            <ErrorMessage name={name} component={TextError}/>
        </div>
    )
}

export default Select