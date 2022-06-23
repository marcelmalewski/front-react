import types from "./types";
const _ = require('lodash');

const initialState = {
    persons: [],
    loading: false,
    error: '',
    personsToDelete: [],
    filters: {
        countryFilters: [],
        periodFilter: "",
        nameFilter: ""
    },
    sortType: 'Aup',
    dataInStore: false,
    loadingBarProgress: 0,
    latestPersonDeletedInPersonDetails: null
}

export const personReducer = (state = initialState, action) => {
    let sortedPersons = []

    switch(action.type) {
        case types.PERSON_LIST_REQUEST_START:
            return { ...state, loading: true, loadingBarProgress: 50 }
        case types.PERSON_LIST_REQUEST_SUCCESS:
            //domyslnie persons są posortowani alfabetycznie
            sortedPersons = _.orderBy(action.payload, ['first_name', 'last_name'])
            return { ...state, persons: [...sortedPersons], loading: false, error: '', loadingBarProgress: 100, sortType: 'Aup' } 
        case types.PERSON_LIST_REQUEST_FAILURE:
            return { ...state, loading: false, error: action.payload, loadingBarProgress: 100 } 
        case types.PERSON_ADD_TO_DELETE:
            return { ...state, personsToDelete: [ ...state.personsToDelete, action.payload] }
        case types.PERSON_REMOVE_FROM_TO_DELETE:
            return { ...state, personsToDelete: [ ...state.personsToDelete.filter(el => el !== action.payload)] }
        case types.PERSON_DELETE_START:
            return { ...state, loadingBarProgress: 50 }
        case types.PERSON_DELETE_SUCCESS:
            alert("person deleted")
            return { ...state, 
                personsToDelete: [...state.personsToDelete.filter(el => parseInt(el) !== parseInt(action.payload))],
                persons: [...state.persons.filter(el => parseInt(el.id) !== parseInt(action.payload))],
                latestPersonDeletedInPersonDetails: parseInt(action.payload),
                loadingBarProgress: 100
            }
        case types.PERSON_DELETE_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.PERSON_SORT:
            return { ...state, persons: [...action.payload]}
        case types.PERSON_CHANGE_COUNTRY_FILTERS:
            return { ...state, filters: {...state.filters, countryFilters: [...action.payload]}}
        case types.PERSON_CHANGE_PERIOD_FILTER:
            return { ...state, filters: {...state.filters, periodFilter: action.payload}}
        case types.PERSON_CHANGE_NAME_FILTER:
            return { ...state, filters: {...state.filters, nameFilter: action.payload}}
        case types.PERSON_ADD_NEW_PERSON_START:
            return { ...state, loadingBarProgress: 50 }
        case types.PERSON_ADD_NEW_PERSON_SUCCESS:
            alert("new person added")
            //domyslnie persons są posortowani alfabetycznie
            sortedPersons = _.orderBy([...state.persons, action.payload], ['first_name', 'last_name'])
            return { ...state, persons: [...sortedPersons], loadingBarProgress: 100, sortType: 'Aup' }
        case types.PERSON_ADD_NEW_PERSON_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.PERSON_SET_DATA_IN_STORE_TRUE:
            return { ...state, dataInStore: true }
        case types.PERSON_CHANGE_LOADING_BAR_PROGRESS:
            return { ...state, loadingBarProgress: action.payload}
        case types.PERSON_GET_ONE_PERSON_START:
            return { ...state, loadingBarProgress: 50 }
        case types.PERSON_GET_ONE_PERSON_SUCCESS:
            return { ...state, persons: [...state.persons.filter(el => parseInt(el.id) !== parseInt(action.payload.id)), action.payload], loadingBarProgress: 100}
        case types.PERSON_GET_ONE_PERSON_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.PERSON_EDIT_START:
            return { ...state, loadingBarProgress: 50 }
        case types.PERSON_EDIT_SUCCESS:
            alert('person edited')
            sortedPersons = _.orderBy([...state.persons.filter(el => el.id !== action.payload.id), action.payload], ['first_name', 'last_name'])
            return { ...state, persons: [...sortedPersons], loadingBarProgress: 100, sortType: 'Aup' }
        case types.PERSON_EDIT_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 } 
        default:
            return state;
    }
}