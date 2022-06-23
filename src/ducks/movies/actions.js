import types from './types';

export const movieChangeLoadingBarProgressAction = (loadingBarProgress) => ({
    type: types.MOVIE_CHANGE_LOADING_BAR_PROGRESS,
    payload: loadingBarProgress
})

export const movieSetDataInStoreTrueAction = () => ({
    type: types.MOVIE_SET_DATA_IN_STORE_TRUE
})

export const movieAddToDeleteAction = (movieId) => ({
    type: types.MOVIE_ADD_TO_DELETE,
    payload: movieId
})

export const movieRemoveFromToDeleteAction = (movieId) => ({
    type: types.MOVIE_REMOVE_FROM_TO_DELETE,
    payload: movieId
})

export const movieAddGenreFilterAction = (filter) => ({
    type: types.MOVIE_ADD_GENRE_FILTER,
    payload: filter
})

export const movieRemoveGenreFilterAction = (filter) => ({
    type: types.MOVIE_REMOVE_GENRE_FILTER,
    payload: filter
})

export const moviesSortAction = (sortedMovies) => ({
    type: types.MOVIE_SORT,
    payload: sortedMovies
})

export const actorAddToDeleteAction = (actorId) => ({
    type: types.MOVIE_ACTOR_ADD_TO_DELETE,
    payload: actorId
})

export const actorRemoveFromToDeleteAction = (actorId) => ({
    type: types.MOVIE_ACTOR_REMOVE_FROM_TO_DELETE,
    payload: actorId
})

export const changeDirectorFilterAction = (directorFilter) => ({
    type: types.MOVIE_CHANGE_DIRECTOR_FILTER,
    payload: directorFilter
})

export const changeTitleFilterAction = (titleFilter) => ({
    type: types.MOVIE_CHANGE_TITLE_FILTER,
    payload: titleFilter
})