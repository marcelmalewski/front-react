export const getPersons = state => state.persons.persons
export const getPersonsToDelete = state => state.persons.personsToDelete
export const getPersonLoading = state => state.persons.loading
export const getPersonError = state => state.persons.error
export const getPersonCountryFilters = state => state.persons.filters.countryFilters
export const getPersonPeriodFilter = state => state.persons.filters.periodFilter
export const getPersonNameFilter = state => state.persons.filters.nameFilter
export const getPersonDataInStore = state => state.persons.dataInStore
export const getPersonLoadingBarProgress = state => state.persons.loadingBarProgress
export const getPersonById = (state, id) => state.persons.persons.find(person => person.id === id)
export const getLatestPersonDeletedInPersonDetails = (state) => state.persons.latestPersonDeletedInPersonDetails