import types from './types';

export const personListRequestSuccessAction = (persons) => ({
    type: types.PERSON_LIST_REQUEST_SUCCESS,
    payload: persons
})

export const personListRequestStartAction = ({
    type: types.PERSON_LIST_REQUEST_SUCCESS
});

export const personListRequestFailureAction = (error) => ({
    type: types.PERSON_LIST_REQUEST_FAILURE,
    payload: error
})

export const personDeleteStartAction = () => ({
    type: types.PERSON_DELETE_START
})

export const personDeleteSuccessAction = (personsId) => ({
    type: types.PERSON_DELETE_SUCCESS,
    payload: personsId
})

export const personDeleteFailureAction = (error) => ({
    type: types.PERSON_DELETE_FAILURE,
    payload: error
})

export const personAddToDeleteAction = (personId) => ({
    type: types.PERSON_ADD_TO_DELETE,
    payload: personId
})

export const personRemoveFromToDeleteAction = (personId) => ({
    type: types.PERSON_REMOVE_FROM_TO_DELETE,
    payload: personId
})

export const personSortAction = (sortedPersons) => ({
    type: types.PERSON_SORT,
    payload: sortedPersons
})

export const personSendCountryFiltersAction = (countryFilters) => ({
    type: types.PERSON_CHANGE_COUNTRY_FILTERS,
    payload: countryFilters
})

export const personSendPeriodFilterAction = (periodFilter) => ({
    type: types.PERSON_CHANGE_PERIOD_FILTER,
    payload: periodFilter
})

export const personSendNameFilterAction = (nameFilter) => ({
    type: types.PERSON_CHANGE_NAME_FILTER,
    payload: nameFilter
})

export const personAddNewPersonStartAction = () => ({
    type: types.PERSON_ADD_NEW_PERSON_START
})

export const personAddNewPersonSuccessAction = (newPerson) => ({
    type: types.PERSON_ADD_NEW_PERSON_SUCCESS,
    payload: newPerson
})

export const personAddNewPersonFailureAction = (error) => ({
    type: types.PERSON_ADD_NEW_PERSON_FAILURE,
    payload: error
})

export const personSetDataInStoreTrueAction = () => ({
    type: types.PERSON_SET_DATA_IN_STORE_TRUE
})

export const personChangeLoadingBarProgressAction = (loadingBarProgress) => ({
    type: types.PERSON_CHANGE_LOADING_BAR_PROGRESS,
    payload: loadingBarProgress
})

export const personGetOnePersonStartAction = () => ({
    type: types.PERSON_GET_ONE_PERSON_START
})

export const personGetOnePersonSuccessAction = (person) => ({
    type: types.PERSON_GET_ONE_PERSON_SUCCESS,
    payload: person
})

export const personGetOnePersonFailureAction = (error) => ({
    type: types.PERSON_GET_ONE_PERSON_FAILURE,
    payload: error
})

export const personEditStartAction = () => ({
    type: types.PERSON_EDIT_START
})

export const personEditSuccessAction = (editedPerson) => ({
    type: types.PERSON_EDIT_SUCCESS,
    payload: editedPerson
})

export const personEditFailureAction = (error) => ({
    type: types.PERSON_EDIT_FAILURE,
    payload: error
})
