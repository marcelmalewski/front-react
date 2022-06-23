import types from "./types";
const _ = require('lodash');

const initialState = {
    movies: [],
    loading: false,
    loadingBarProgress: 0,
    dataInStore: false,
    sortType: 'Aup',
    error: '',
    moviesToDelete: [],
    filters: {
        genreFilters: [],
        directorFilter: null,
        titleFilter: ""
    },
    latestMovieDeletedInMovieDetails: null,
    actors: [],
    actorsToDelete: [],
    moviesGotActors: [], //id of movies which got actors
}

export const movieReducer = (state = initialState, action) => {
    let sortedMovies = []

    switch(action.type) {
        case types.MOVIE_LIST_REQUEST_START:
            return { ...state, loading: true, loadingBarProgress: 50 }
        case types.MOVIE_LIST_REQUEST_SUCCESS:
            //domyslnie movies są posortowani alfabetycznie
            sortedMovies = _.orderBy(action.payload, ['title'])
            return { ...state, movies: [...sortedMovies], loading: false, error: '', loadingBarProgress: 100, sortType: 'Aup' } 
        case types.MOVIE_LIST_REQUEST_FAILURE:
            return { ...state, loading: false, error: action.payload, loadingBarProgress: 100 } 
        case types.MOVIE_CHANGE_LOADING_BAR_PROGRESS:
            return { ...state, loadingBarProgress: action.payload}
        case types.MOVIE_SET_DATA_IN_STORE_TRUE:
            return { ...state, dataInStore: true }
        case types.MOVIE_ADD_TO_DELETE:
            return { ...state, moviesToDelete: [ ...state.moviesToDelete, action.payload] }
        case types.MOVIE_REMOVE_FROM_TO_DELETE:
            return { ...state, moviesToDelete: [ ...state.moviesToDelete.filter(el => el !== action.payload)] }
        case types.MOVIE_ADD_GENRE_FILTER:
            return { ...state, filters: {...state.filters, genreFilters: [...state.filters.genreFilters, action.payload]}}
        case types.MOVIE_REMOVE_GENRE_FILTER:
            return { ...state, filters: {...state.filters, genreFilters: [...state.filters.genreFilters.filter(el => el !== action.payload)]}}
        case types.MOVIE_CHANGE_DIRECTOR_FILTER:
            return { ...state, filters: {...state.filters, directorFilter: action.payload}}
        case types.MOVIE_CHANGE_TITLE_FILTER:
            return { ...state, filters: {...state.filters, titleFilter: action.payload}}
        case types.MOVIE_SORT:
            return { ...state, movies: [...action.payload]}
        case types.MOVIE_DELETE_START:
            return { ...state, loadingBarProgress: 50 }
        case types.MOVIE_DELETE_SUCCESS:
            alert("movie deleted")
            return { ...state, 
                moviesToDelete: [...state.moviesToDelete.filter(el => parseInt(el) !== parseInt(action.payload))],
                movies: [...state.movies.filter(el => parseInt(el.id) !== parseInt(action.payload))],
                latestMovieDeletedInMovieDetails: parseInt(action.payload),
                loadingBarProgress: 100
            }
        case types.MOVIE_DELETE_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.MOVIE_ADD_NEW_MOVIE_START:
            return { ...state, loadingBarProgress: 50 }
        case types.MOVIE_ADD_NEW_MOVIE_SUCCESS:
            alert("new movie added")
            //domyslnie movies są posortowani alfabetycznie
            sortedMovies = _.orderBy([...state.movies, action.payload], ['title'])
            return { ...state, movies: [...sortedMovies], loadingBarProgress: 100, sortType: 'Aup' }
        case types.MOVIE_ADD_NEW_MOVIE_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.MOVIE_EDIT_START:
            return { ...state, loadingBarProgress: 50 }
        case types.MOVIE_EDIT_SUCCESS:
            alert('movie edited')
            sortedMovies = _.orderBy([...state.movies.filter(el => el.id !== action.payload.id), action.payload], ['title'])
            return { ...state, movies: [...sortedMovies], loadingBarProgress: 100, sortType: 'Aup' }
        case types.MOVIE_EDIT_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.MOVIE_GET_ONE_MOVIE_START:
            return { ...state, loadingBarProgress: 50 }
        case types.MOVIE_GET_ONE_MOVIE_SUCCESS:
            return { ...state, movies: [...state.movies, action.payload], loadingBarProgress: 100}
        case types.MOVIE_GET_ONE_MOVIE_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.MOVIE_GET_ACTORS_START:
            return { ...state, loadingBarProgress: 50 }
        case types.MOVIE_GET_ACTORS_SUCCESS:
            const newActors = [...state.actors, ...action.payload[0]].filter((item, index, self) =>
                    index === self.findIndex((t) => (
                        t.person_id === item.person_id && t.movie_id === item.movie_id
                    ))
                )

            const newMoviesGotActors = state.moviesGotActors.includes(action.payload[1]) 
                ? [...state.moviesGotActors] 
                : [...state.moviesGotActors, action.payload[1]]

            return { ...state, 
                actors: [ ...newActors],
                moviesGotActors: [...newMoviesGotActors],
                loadingBarProgress: 100
            }
        case types.MOVIE_GET_ACTORS_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100}
        case types.MOVIE_ACTOR_ADD_TO_DELETE:
            return { ...state, actorsToDelete: [...state.actorsToDelete, action.payload]}
        case types.MOVIE_ACTOR_REMOVE_FROM_TO_DELETE:
            return { ...state, actorsToDelete: [ ...state.actorsToDelete.filter(el => el !== action.payload)] }
        case types.MOVIE_DELETE_ACTOR_START:
            return { ...state, loadingBarProgress: 50 }
        case types.MOVIE_DELETE_ACTOR_SUCCESS:
            alert("actor deleted")
            return { ...state, 
                actorsToDelete: [...state.actorsToDelete.filter(el => parseInt(el) !== parseInt(action.payload.actorId))],
                actors: [
                    ...state.actors.filter(
                        el => {
                            if(parseInt(el.person_id) === parseInt(action.payload.actorId) && parseInt(el.movie_id) === parseInt(action.payload.movieId)){
                                return false
                            } else {
                                return true
                            }
                            
                        }
                    )
                ],
                loadingBarProgress: 100
            }
        case types.MOVIE_DELETE_ACTOR_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.MOVIE_ADD_ACTOR_START:
            return { ...state, loadingBarProgress: 50 }
        case types.MOVIE_ADD_ACTOR_SUCCESS:
            alert("actor added")
            return { ...state, actors: [...state.actors, action.payload], loadingBarProgress: 100}
        case types.MOVIE_ADD_ACTOR_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        case types.MOVIE_CHANGE_DIRECTOR_START:
            return { ...state, loadingBarProgress: 50 }
        case types.MOVIE_CHANGE_DIRECTOR_SUCCESS:
            alert("director changed")
            const newDirectorId = action.payload[1]
            const changedMovieId = parseInt(action.payload[0])
            const changedMovie = state.movies.find(el => el.id === changedMovieId)
            changedMovie.director_id = newDirectorId
            
            return { ...state, movies: [...state.movies.filter(el => el.id !== changedMovieId), changedMovie], loadingBarProgress: 100}
        case types.MOVIE_CHANGE_DIRECTOR_FAILURE:
            alert(action.payload)
            return { ...state, loadingBarProgress: 100 }
        default:
            return state;
    }
}