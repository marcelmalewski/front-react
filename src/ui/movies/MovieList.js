import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { getMovieDirectorFilter, getMovieGenreFilters, getMovies, getMoviesToDelete, getAllActors, getMovieTitleFilter } from "../../ducks/movies/selectors";
import { Link } from 'react-router-dom';
import './MovieList.scss'
import OneMovie from "./OneMovie";
import { sortMovies, deleteMovie, deleteActor } from "../../ducks/movies/operations";

const MovieList = ({ actors, 
    directorFilter, 
    genreFilters, 
    movies, 
    moviesToDelete, 
    sortMovies, 
    deleteMovie, 
    deleteActor,
    titleFilter
} ,props) => {
    const [filteredMovies, setFilteredMovies] = useState([])

    const handleDelete = async () => {
        //idze po array i po kolei movieDelete na kazdym
        for (const movieId of moviesToDelete) {
            //najpierw usuwanie aktorow 
            await actors.forEach(async el => {
                if(el.movie_id === movieId) {
                    await deleteActor(movieId, el.person_id)
                }
            })

            await deleteMovie(movieId)
        }
    }

    const groupBy =(arr, criteria) => {
        const newObj = arr.reduce(function (acc, currentValue) {
          if (!acc[currentValue[criteria]]) {
            acc[currentValue[criteria]] = 0;
          }
          acc[currentValue[criteria]] += 1;
          return acc;
        }, {});


        return newObj;
    }

    
    const handleChangeSortType = (event) => {
        if(event.target.value === 'Actorsup' || event.target.value === 'Actorsdown'){
            const numbersOfActors = groupBy(actors, "movie_id")
            const moviesWithNumberOfActors = movies.map(el => 
                ({...el, number_of_actors: numbersOfActors[el.id] ? numbersOfActors[el.id] : 0})
            )

            sortMovies(moviesWithNumberOfActors, event.target.value)
        } else {
            sortMovies(movies, event.target.value)
        }
    }

    useEffect(() => {
        setFilteredMovies([
            ...movies.filter(movie => {
                let result = true

                if(genreFilters.length !== 0){
                    if (genreFilters.includes(movie.genre) === false) result = false
                }

                if(directorFilter !== null){
                    if (directorFilter !== movie.director_id) result = false
                }

                if(titleFilter !== ""){
                    const titleRegex = new RegExp('^' + titleFilter.toLowerCase())
                    if (titleRegex.test(movie.title.toLowerCase()) === false) result = false
                }

                return result

            })
        ])
    }, [movies, genreFilters, directorFilter, titleFilter]);

    return (
        <div className='ListOfMovies'>
            <div className='TitleAndAddBox'>
                <p className='pMovies'>Movies</p>
                <Link className='LinkAddAndEditMovie' to='/movies/form'><p className='pAdd'>Add movie</p></Link>
            </div>

            {/* form  zebye deletowac books*/}
            <form>
                <div className='SortAndDelete'>
                    <div className="choose">
                        <p className='pSort'>Sort: </p>
                        <select className="options" 
                            onChange={(event) => handleChangeSortType(event)}
                        >
                            <option value='Aup'>Alphabetically ascending</option>
                            <option value='Adown'>Alphabetically descending</option>
                            <option value='Dup'>Release date ascending</option>
                            <option value='Ddown'>Release date descending</option>
                            {/* trzecie będzie wedlug ilosc filmow w jakich zagral */}
                            <option value='Actorsup'>Number of actors ascending</option>
                            <option value='Actorsdown'>Number of actors descending</option>
                        </select>
                    </div>
                    <button type='button' onClick={handleDelete}>Delete</button>
                </div>
                
                {filteredMovies
                    .map(movie =>
                        <OneMovie 
                            key={movie.id}
                            id={movie.id}
                            title={movie.title} 
                            release_date={movie.release_date} 
                            image_url={movie.image_url} 
                            director_id={movie.director_id} 
                            genre={movie.genre}
                        />
                    )
                }
            </form>
        </div>
    )
};
const mapStateToProps = (state) => {
    return {
        movies: getMovies(state),
        moviesToDelete: getMoviesToDelete(state),
        genreFilters: getMovieGenreFilters(state),
        directorFilter: getMovieDirectorFilter(state),
        titleFilter: getMovieTitleFilter(state),
        actors: getAllActors(state)
    };
}

const mapDispatchToProps = {
    deleteMovie,
    sortMovies,
    deleteActor
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
