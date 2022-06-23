export const getMovieLoadingBarProgress = state => state.movies.loadingBarProgress
export const getMovieDataInStore = state => state.movies.dataInStore
export const getMovieLoading = state => state.movies.loading
export const getMovieError = state => state.movies.error
export const getMoviesToDelete = state => state.movies.moviesToDelete
export const getMovies = state => state.movies.movies
export const getMovieGenreFilters = state => state.movies.filters.genreFilters
export const getMovieDirectorFilter = state => state.movies.filters.directorFilter
export const getMovieTitleFilter = state => state.movies.filters.titleFilter
export const getMovieById = (state, id) => state.movies.movies.find(movie => movie.id === id)
export const getLatestMovieDeletedInMovieDetails = (state) => state.movies.latestMovieDeletedInMovieDetails
export const getDirectorOfMovie = (state, director_id) => state.persons.persons.find(person => person.id === director_id)
export const getActorsOfMovie = (state, movie_id) => state.movies.actors.filter(actor => actor.movie_id === movie_id)
export const getMoviesGotActors = (state) => state.movies.moviesGotActors
export const getActorsToDelete = state => state.movies.actorsToDelete
export const getAllDirectorsId = state => state.movies.movies.map(el => el.director_id)
export const getAllActors = state => state.movies.actors