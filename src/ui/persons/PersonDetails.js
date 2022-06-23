import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { getLatestPersonDeletedInPersonDetails, getPersonById, getPersonLoadingBarProgress } from '../../ducks/persons/selectors';
import { deletePerson, getOnePerson } from '../../ducks/persons/operations';
import './PersonDetails.scss'
import { personChangeLoadingBarProgressAction } from '../../ducks/persons/actions';
import { getAllActors, getMovieDataInStore, getMovieLoadingBarProgress, getMovies, getMoviesGotActors } from '../../ducks/movies/selectors';
import { editMovie, getActors, getMovieList } from '../../ducks/movies/operations';
import { movieChangeLoadingBarProgressAction, movieSetDataInStoreTrueAction } from '../../ducks/movies/actions';
import OneMovieInPersonDetails from './OneMovieInPersonDetails'
import { deleteActor } from '../../ducks/movies/operations';

const PersonDetails = ({ 
    deletePerson, 
    getOnePerson, 
    personLoadingBarProgress, 
    personChangeLoadingBarProgressAction,
    latestPersonDeletedInPersonDetails,
    moviesListInStore,
    getMovieList,
    movieSetDataInStoreTrueAction,
    movieLoadingBarProgress,
    movieChangeLoadingBarProgressAction,
    movies,
    moviesGotActors,
    getActors,
    actors,
    deleteActor,
    editMovie
}) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const person = useSelector((state) => getPersonById(state, parseInt(id)))

    const playedMoviesId = actors.filter(el => el.person_id === parseInt(id)).map(el => el.movie_id)
    const moviesListHePlayedIn = movies.filter(el => playedMoviesId.includes(el.id))

    const moviesListHeDirected = movies.filter(el => el.director_id === (person ? person.id : ""))

    const handleDelete = async () => {
        //najpierw usuwamy aktorow
        //zrobic operacje delete actor by person
        //usuwanie aktorow najpierw
        await actors.forEach(async el => {
            if(el.person_id === parseInt(id)) {
                await deleteActor(el.movie_id, el.person_id)
            }
        })
        //usuwanie dyrektorow
        await movies.forEach( async el => {
            if(el.director_id === parseInt(id)){
                await editMovie({
                    id: el.id,
                    title: el.title,
                    genre: el.genre,
                    release_date: el.release_date,
                    image_url: el.image_url,
                    description: el.description
                })
            }
        })

        deletePerson(id).then(() => {
            navigate("/persons")
        })
    }

    useEffect(() => {
        if (person === undefined && latestPersonDeletedInPersonDetails !== parseInt(id)){
            //person nie ma w store trzeba sprobwac pobrac z bazy danych
            getOnePerson(id)
        }

        //musze pobrac wszytkie filmy 
        //jak mam juz wszytkie filmy moge pobrac wszystkich aktorow
        //moge wyselektowac ktorzy aktorzy to ta osoba 
        //wziąć id filmow z wyselektowanych aktorow
        //filmu forEach i tylko ten ktorego id jest w id powyzej jest pokazywany na liscie

        if(moviesListInStore === false) {
            getMovieList()
            movieSetDataInStoreTrueAction()
        }

        movies.forEach(movie => {
            if(moviesGotActors.indexOf(movie.id) === -1) getActors(movie.id)
        })

    }, [person, 
        getOnePerson, 
        id, 
        latestPersonDeletedInPersonDetails, 
        getMovieList, 
        moviesListInStore, 
        movieSetDataInStoreTrueAction,
        movies,
        moviesGotActors,
        getActors
    ]);

    return (
        <div className='personDetailsBox'>
            <LoadingBar
                color='white'
                progress={personLoadingBarProgress}
                onLoaderFinished={() => personChangeLoadingBarProgressAction(0)}
            />
            <LoadingBar
                color='white'
                progress={movieLoadingBarProgress}
                onLoaderFinished={() => movieChangeLoadingBarProgressAction(0)}
            />
            <div className='personDetailsAndButtonsBox'>
                <div className='personDetails'>
                    <p className="first_name">{person ? person.first_name : ""}</p>
                    <p className="last_name">{person ? person.last_name : ""}</p>
                    <p className="nationality">{person ? person.nationality : ""}</p>
                    <p className="birth_date">
                        <span>Birth date:</span> 
                        {person ? person.birth_date.substr(0,10) : ""}
                    </p>
                </div>
                <div className='buttonsBox'>
                    <Link to={`/persons/form/${id}`} className='editLink'>Edit</Link>
                    <button type='button' className='deleteButton' onClick={() => handleDelete()}>Delete</button>
                </div>
            </div>
            <div className='actorsAndDirectorsBox'>
                <div className='playedIn'>
                    <p className='playedInP'>
                        {person ? person.first_name : ""} played in:
                    </p>
                    {moviesListHePlayedIn
                        .map(movie =>
                            <OneMovieInPersonDetails
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
                </div>
                <div className='isDirector'>
                    <p className='directorInP'>
                        {person ? person.first_name : ""} was director in:
                    </p>
                    {moviesListHeDirected
                        .map(movie =>
                            <OneMovieInPersonDetails
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
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    
    return {
        personLoadingBarProgress: getPersonLoadingBarProgress(state),
        latestPersonDeletedInPersonDetails: getLatestPersonDeletedInPersonDetails(state),
        moviesListInStore: getMovieDataInStore(state),
        movieLoadingBarProgress: getMovieLoadingBarProgress(state),
        movies: getMovies(state),
        moviesGotActors: getMoviesGotActors(state),
        actors: getAllActors(state)
    };
}

const mapDispatchToProps = {
    getOnePerson,
    personChangeLoadingBarProgressAction,
    deletePerson,
    getMovieList,
    movieSetDataInStoreTrueAction,
    movieChangeLoadingBarProgressAction,
    getActors,
    deleteActor,
    editMovie
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetails);
