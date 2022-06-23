import { createAction } from "redux-api-middleware"
import * as actions from './actions'
import types from './types';
const _ = require('lodash');

export const getMovieList = () => {
    return createAction({
        endpoint: 'http://localhost:5000/api/movies',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            types.MOVIE_LIST_REQUEST_START,
            types.MOVIE_LIST_REQUEST_SUCCESS,
            types.MOVIE_LIST_REQUEST_FAILURE
        ],
    })
}

export const addNewMovie = (newMovie) => {
    return createAction({
        endpoint: 'http://localhost:5000/api/movies',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovie),
        types: [
            types.MOVIE_ADD_NEW_MOVIE_START,
            types.MOVIE_ADD_NEW_MOVIE_SUCCESS,
            types.MOVIE_ADD_NEW_MOVIE_FAILURE
        ],
    })
}

export const editMovie = (editedMovie) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${editedMovie.id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedMovie),
        types: [
            types.MOVIE_EDIT_START,
            {
                type: types.MOVIE_EDIT_SUCCESS,
                payload: async (action, state, res) => {  
                    const movie = await res.json();
                    return {
                        id: movie.id,
                        title: movie.title,
                        genre: movie.genre,
                        release_date: movie.release_date,
                        image_url: movie.image_url,
                        director_id: movie.director ? movie.director.id : null,
                        description: movie.description
                    }
                }
            },
            types.MOVIE_EDIT_FAILURE
        ],
    })
}

export const deleteMovie = (movieId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movieId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            types.MOVIE_DELETE_START,
            {
                //api przy delete nic nie zwraca dlatego sam daje tam usuniete movieId
                type: types.MOVIE_DELETE_SUCCESS,
                payload: movieId
            },
            types.MOVIE_DELETE_FAILURE
        ]
    })
}

export const getOneMovie = (movieId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movieId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            types.MOVIE_GET_ONE_MOVIE_START,
            types.MOVIE_GET_ONE_MOVIE_SUCCESS,
            types.MOVIE_GET_ONE_MOVIE_FAILURE
        ],
    })
}

export const getActors = (movieId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movieId}/actors`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            types.MOVIE_GET_ACTORS_START,
            {
                type: types.MOVIE_GET_ACTORS_SUCCESS,
                payload: async (action, state, res) => {  
                    const actors = await res.json();
                    return [actors, movieId];
                }
            },
            types.MOVIE_GET_ACTORS_FAILURE
        ],
    })
}

export const addActor = (movieId, actorId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movieId}/actors`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: actorId}),
        types: [
            types.MOVIE_ADD_ACTOR_START,
            types.MOVIE_ADD_ACTOR_SUCCESS,
            types.MOVIE_ADD_ACTOR_FAILURE
        ],
    })
}

export const deleteActor = (movieId, actorId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movieId}/actors/${actorId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            types.MOVIE_DELETE_ACTOR_START,
            {
                //api przy delete nic nie zwraca dlatego sam daje tam usuniete actorId
                type: types.MOVIE_DELETE_ACTOR_SUCCESS,
                payload: {actorId: actorId, movieId: movieId}
            },
            types.MOVIE_DELETE_ACTOR_FAILURE
        ],
    })
}

export const changeDirector = (movieId, directorId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movieId}/director`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: directorId}),
        types: [
            types.MOVIE_CHANGE_DIRECTOR_START,
            {
                //api przy delete nic nie zwraca dlatego sam zwaracam
                type: types.MOVIE_CHANGE_DIRECTOR_SUCCESS,
                payload: [movieId, directorId]
            },
            types.MOVIE_CHANGE_DIRECTOR_FAILURE
        ],
    })
}

export const sendGenreFilter = (filter, filters) => {
    return async dispatch => {
        if(filters.includes(filter)) {
            dispatch(actions.movieRemoveGenreFilterAction(filter))
        } else {
            dispatch(actions.movieAddGenreFilterAction(filter))
        }
    }
}

export const sortMovies = (movies, sortType) => {
    let sortedMoviesWithoutNumberOfActors = []

    return async dispatch => {
        switch(sortType) {
            case 'Aup':
                dispatch(actions.moviesSortAction( _.orderBy(movies, ['title'])))
                break;
            case 'Adown':
                dispatch(actions.moviesSortAction( _.orderBy(movies, ['title'], 'desc')))
                break; 
            case 'Dup':
                dispatch(actions.moviesSortAction( _.orderBy(movies, (movie) => new Date(movie.release_date), 'asc') ))
                break;
            case 'Ddown':
                dispatch(actions.moviesSortAction( _.orderBy(movies, (movie) => new Date(movie.release_date), 'desc') ))
                break;
            //sortowanie po ilosci aktorow
            case 'Actorsup':
                sortedMoviesWithoutNumberOfActors = _.orderBy(movies, ['number_of_actors'], 'asc')
                sortedMoviesWithoutNumberOfActors.forEach(el => delete el.number_of_actors)
                dispatch(actions.moviesSortAction(sortedMoviesWithoutNumberOfActors))
                break;
            case 'Actorsdown':
                sortedMoviesWithoutNumberOfActors = _.orderBy(movies, ['number_of_actors'], 'desc')
                sortedMoviesWithoutNumberOfActors.forEach(el => delete el.number_of_actors)
                dispatch(actions.moviesSortAction(sortedMoviesWithoutNumberOfActors))
                break;
            default:
        }
    }
}