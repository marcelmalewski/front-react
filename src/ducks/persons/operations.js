import { createAction } from "redux-api-middleware"
import * as actions from './actions'
import types from './types';
const _ = require('lodash');

export const addNewPerson = (newPerson) => {
    return createAction({
        endpoint: 'http://localhost:5000/api/persons',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPerson),
        types: [
            types.PERSON_ADD_NEW_PERSON_START,
            types.PERSON_ADD_NEW_PERSON_SUCCESS,
            types.PERSON_ADD_NEW_PERSON_FAILURE
        ],
    })
}

export const editPerson = (editedPerson) => {
    return createAction({
        endpoint: `http://localhost:5000/api/persons/${editedPerson.id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedPerson),
        types: [
            types.PERSON_EDIT_START,
            types.PERSON_EDIT_SUCCESS,
            types.PERSON_EDIT_FAILURE
        ],
    })
}

export const getOnePerson = (personId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/persons/${personId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            types.PERSON_GET_ONE_PERSON_START,
            types.PERSON_GET_ONE_PERSON_SUCCESS,
            types.PERSON_GET_ONE_PERSON_FAILURE
        ],
    })
}

export const getPersonList = () => {
    return createAction({
        endpoint: 'http://localhost:5000/api/persons',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            types.PERSON_LIST_REQUEST_START,
            types.PERSON_LIST_REQUEST_SUCCESS,
            types.PERSON_LIST_REQUEST_FAILURE
        ],
    })
}

export const deletePerson = (personId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/persons/${personId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            types.PERSON_DELETE_START,
            {
                //api przy delete nic nie zwraca dlatego sam daje tam usuniete personId
                type: types.PERSON_DELETE_SUCCESS,
                payload: personId
            },
            types.PERSON_DELETE_FAILURE
        ]
    })
}

export const sortPersons = (persons, sortType) => {
    let sortedPersonsWithoutNumberOfMovies

    return async dispatch => {
        switch(sortType) {
            case 'Aup':
                dispatch(actions.personSortAction( _.orderBy(persons, ['first_name', 'last_name']) ))
                break;
            case 'Adown':
                dispatch(actions.personSortAction( _.orderBy(persons, ['first_name', 'last_name'], ['desc', 'desc']) ))
                break; 
            case 'Dup':
                dispatch(actions.personSortAction( _.orderBy(persons, (person) => new Date(person.birth_date), 'asc') ))
                break;
            case 'Ddown':
                dispatch(actions.personSortAction( _.orderBy(persons, (person) => new Date(person.birth_date), 'desc') ))
                break;
            //sortowanie po ilosci filmow w jakich grali
            case 'Moviesup':
                sortedPersonsWithoutNumberOfMovies = _.orderBy(persons, ['number_of_movies'], 'asc')
                sortedPersonsWithoutNumberOfMovies.forEach(el => delete el.number_of_movies)
                dispatch(actions.personSortAction(sortedPersonsWithoutNumberOfMovies))
                break;
            case 'Moviesdown':
                sortedPersonsWithoutNumberOfMovies = _.orderBy(persons, ['number_of_movies'], 'desc')
                sortedPersonsWithoutNumberOfMovies.forEach(el => delete el.number_of_movies)
                dispatch(actions.personSortAction(sortedPersonsWithoutNumberOfMovies))
                break;
            default:
        }
    }
}