import React from 'react'
import { connect, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
import FormikControl from '../formControls/FormikControl'
import './MovieForm.scss'
import { Formik, Form } from 'formik'
import * as Yup from 'yup';
import { useState, useEffect } from "react";
import { addNewMovie, editMovie, getOneMovie } from '../../ducks/movies/operations';
import { getMovieById, getMovieLoadingBarProgress } from '../../ducks/movies/selectors';
import { getPersonDataInStore, getPersonLoadingBarProgress, getPersons } from '../../ducks/persons/selectors';
import { movieChangeLoadingBarProgressAction } from '../../ducks/movies/actions';
import { getPersonList } from '../../ducks/persons/operations';
import { personChangeLoadingBarProgressAction, personSetDataInStoreTrueAction } from '../../ducks/persons/actions';

const MovieForm = ({ 
    persons,
    editMovie,
    addNewMovie, 
    movieLoadingBarProgress, 
    movieChangeLoadingBarProgressAction, 
    getOneMovie, 
    arePersonsInStore,
    getPersonList,
    personSetDataInStoreTrueAction,
    personLoadingBarProgress,
    personChangeLoadingBarProgressAction
}, props) => {
    const [formValues, setFormValues] = useState(null)
    const { id } = useParams()
    const movie = useSelector((state) => getMovieById(state, parseInt(id)))
    const personsOptionsWithIds = [
        ({ key: 'Select a director', value: ""}), 
        ...persons.map(person => ({key: `${person.first_name} ${person.last_name}`, value: `${person.id}`}))
    ]

    const genres = [
        { key: 'Select a genre', value: ''},
        { key: 'Action', value: 'Action'},
        { key: 'Drama', value: 'Drama'},
        { key: 'Romance', value: 'Romance'},
        { key: 'History', value: 'History'},
        { key: 'Fantasy', value: 'Fantasy'},
        { key: 'Religion', value: 'Religion'},
        { key: 'Mystery', value: 'Mystery'},
        { key: 'Horror', value: 'Horror'},
        { key: 'Thriller', value: 'Thriller'},
        { key: 'Biographie', value: 'Biographie'},
        { key: 'Comedy', value: 'Comedy'},
        { key: 'Science', value: 'Science'},
        { key: 'Travel', value: 'Travel'}
    ]

    const initialValues = {
        title: "",
        genre: "",
        release_date: null,
        image_url: "",
        director_id: "",
        description: ""
    }

    const validationSchema = Yup.object({
        title: Yup.string().required('Required'),
        genre: Yup.string().required('Required'),
        release_date: Yup.date().required('Required').nullable(),
        description: Yup.string().required('Required').max(400, 'maxiumum length is 400'),
        image_url: Yup.string(),
        director_id: Yup.string(),
    })

    const onSubmit = async ( values, onSubmitProps ) => {
        if(id === undefined) {
            const newMovie = {
                title: values.title,
                genre: values.genre,
                release_date: values.release_date,
                image_url: values.image_url,
                director: (values.director_id !== "" && values.director_id !== null ? {id: parseInt(values.director_id)} : null),
                description: values.description
            }
            await addNewMovie(newMovie)
        } else {
            const editedMovie = {
                id: parseInt(id),
                title: values.title,
                genre: values.genre,
                release_date: values.release_date,
                image_url: values.image_url,
                director: (values.director_id !== "" && values.director_id !== null ? {id: parseInt(values.director_id)} : null),
                description: values.description
            }
            await editMovie(editedMovie)
        }
        
        onSubmitProps.setSubmitting(false);
        onSubmitProps.resetForm()

    }

    useEffect(() => {
        if(arePersonsInStore === false) {
            getPersonList()
            personSetDataInStoreTrueAction()
        }
        //jezeli id to undefined to jestesmy w dodawaniu movie
        //if id === undefined to jestesmy w edytowaniu i trzeba go pobrac
        if(id !== undefined){
            if(movie === undefined){
                //pobieramy person czyli zmienimy persons i to wywoła jeszcze raz tego useEffect
                //ale tym razem przejdzie do else i uzupelni wartosci
                getOneMovie(id)
            } else {
                //movie jest w store i bierzemy go ze store
                const savedValues = {
                    title: movie.title,
                    genre: movie.genre,
                    release_date: new Date(movie.release_date),
                    image_url: movie.image_url,
                    director_id: movie.director_id ? movie.director_id : "",
                    description: movie.description
                }
                setFormValues(savedValues)
            }
        }

    }, [movie, id, getOneMovie, arePersonsInStore, getPersonList, personSetDataInStoreTrueAction])

    return (
        <div className='MovieFormBox'>
            <LoadingBar
                color='white'
                progress={movieLoadingBarProgress}
                onLoaderFinished={() => movieChangeLoadingBarProgressAction(0)}
            />
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
                        <div className='movieFormBox'>
                            <div className='movieForm1'>
                                <FormikControl control='input' type='text' label='Title' name='title' />
                                <FormikControl control='select' label='Genre' options={genres} name='genre' />
                                <FormikControl control='select' label='Director' options={personsOptionsWithIds} name='director_id' />
                                <FormikControl control='input' type='text' label='Image url' name='image_url' />
                                <FormikControl control='date' label='Release date' name='release_date' />
                            </div>
                            <div className='movieForm2'>
                                <FormikControl control='textarea' label='Description' name='description' />
                            </div>
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
        movieLoadingBarProgress: getMovieLoadingBarProgress(state),
        persons: getPersons(state),
        arePersonsInStore: getPersonDataInStore(state),
        personLoadingBarProgress: getPersonLoadingBarProgress(state)
    };
}

const mapDispatchToProps = {
    addNewMovie,
    movieChangeLoadingBarProgressAction,
    getOneMovie,
    editMovie,
    getPersonList,
    personSetDataInStoreTrueAction,
    personChangeLoadingBarProgressAction
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieForm);
