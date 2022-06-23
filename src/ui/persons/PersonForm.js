import React from 'react'
import { connect, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
import FormikControl from '../formControls/FormikControl'
import './PersonForm.scss'
import { Formik, Form } from 'formik'
import * as Yup from 'yup';
import { useState, useEffect } from "react";
import { addNewPerson, editPerson, getOnePerson } from '../../ducks/persons/operations';
import { getPersonById, getPersonLoadingBarProgress } from '../../ducks/persons/selectors';
import { personChangeLoadingBarProgressAction } from '../../ducks/persons/actions';

const PersonForm = ({ editPerson, addNewPerson, personLoadingBarProgress, personChangeLoadingBarProgressAction, getOnePerson }, props) => {
    const [formValues, setFormValues] = useState(null)
    const { id } = useParams()
    const person = useSelector((state) => getPersonById(state, parseInt(id)))

    const countriesOptions = [
        { key: 'Select a nationality', value: ''},
        { key: 'Russia', value: 'Russia'},
        { key: 'Germany', value: 'Germany'},
        { key: 'France', value: 'France'},
        { key: 'Spain', value: 'Spain'},
        { key: 'Poland', value: 'Poland'},
        { key: 'Canada', value: 'Canada'},
        { key: 'Ukraine', value: 'Ukraine'},
        { key: 'Austira', value: 'Austria'},
        { key: 'Monako', value: 'Monako'},
        { key: 'Norway', value: 'Norway'},
        { key: 'Japoan', value: 'Japan'},
        { key: 'China', value: 'China'},
        { key: 'Finland', value: 'Finland'},
        { key: 'Barcelona',value: 'Barcelona'},
        { key: 'Mesico', value: 'Mexico'},
        { key: 'Hawaii', value: 'Hawaii'},
    ]

    const initialValues = {
        first_name: "",
        last_name: "",
        birth_date: null,
        nationality: ""
    }

    const validationSchema = Yup.object({
        first_name: Yup.string().required('Required'),
        last_name: Yup.string().required('Required'),
        birth_date: Yup.date().required('Required').nullable(),
        nationality: Yup.string().required('Required')
    })

    const onSubmit = async ( values, onSubmitProps ) => {
        if(id === undefined) {
            const newPerson = {
                first_name: values.first_name,
                last_name: values.last_name,
                birth_date: values.birth_date,
                nationality: values.nationality
            }
            await addNewPerson(newPerson)
        } else {
            const editedPerson = {
                id: parseInt(id),
                first_name: values.first_name,
                last_name: values.last_name,
                birth_date: values.birth_date,
                nationality: values.nationality
            }
            await editPerson(editedPerson)
        }
        
        onSubmitProps.setSubmitting(false);
        onSubmitProps.resetForm()

    }

    useEffect(() => {
        //jezeli id to undefined to jestesmy w dodawaniu uzytkownika
        //if id === undefined to jestesmy w edytowaniu i trzeba go pobrac
        if(!(id === undefined)){
            //person === undefined czyli nie ma go w store to trzeba go pobrac
            if(person === undefined){
                //pobieramy person czyli zmienimy persons i to wywoła jeszcze raz tego useEffect
                //ale tym razem przejdzie do else i uzupelni wartosci
                getOnePerson(id)
            } else {
                //person jest w store i bierzemy go ze store
                const savedValues = {
                    first_name: person.first_name,
                    last_name: person.last_name,
                    birth_date: new Date(person.birth_date),
                    nationality: person.nationality
                }
                setFormValues(savedValues)
            }
        }
    }, [person, id, getOnePerson])

    return (
        <div className='PersonFormBox'>
            <LoadingBar
                color='white'
                progress={personLoadingBarProgress}
                onLoaderFinished={() => personChangeLoadingBarProgressAction(0)}
            />
            <Formik
                initialValues={formValues || initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {
                    formik => <Form>
                        <div className='personForm'>
                            <FormikControl control='input' type='text' label='First name' name='first_name' />
                            <FormikControl control='input' type='text' label='Last name' name='last_name' />
                            <FormikControl control='select' label='Nationality' options={countriesOptions} name='nationality' />
                            <FormikControl control='date' label='Birth date' name='birth_date' />
                        </div>

                        <div className='buttonBox'>
                            <button type='submit' disabled={ formik.isSubmitting }>Submit</button>
                        </div>
                        
                    </Form>
                }

            </Formik>
        </div>
    )
}

const mapStateToProps = (state) => {
    
    return {
        personLoadingBarProgress: getPersonLoadingBarProgress(state)
    };
}

const mapDispatchToProps = {
    addNewPerson,
    personChangeLoadingBarProgressAction,
    getOnePerson,
    editPerson
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonForm);
