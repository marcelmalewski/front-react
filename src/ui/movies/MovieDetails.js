import React, { useState } from 'react'
import LoadingBar from 'react-top-loading-bar'
import { connect } from "react-redux";
import { useEffect } from 'react'
import Select from 'react-select';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { getMovieById, 
    getMovieLoadingBarProgress, 
    getLatestMovieDeletedInMovieDetails,
    getActorsOfMovie, 
    getMoviesGotActors, 
    getActorsToDelete, 
    getAllActors
} from '../../ducks/movies/selectors';
import { addActor, changeDirector, deleteActor, deleteMovie, getActors, getOneMovie } from '../../ducks/movies/operations';
import { movieChangeLoadingBarProgressAction } from '../../ducks/movies/actions';
import { getPersonList } from '../../ducks/persons/operations';
import { getPersonDataInStore, getPersonLoadingBarProgress, getPersons } from '../../ducks/persons/selectors';
import { personChangeLoadingBarProgressAction, personSetDataInStoreTrueAction } from '../../ducks/persons/actions';
import './MovieDetails.scss'
import OneActor from './OneActor';
const _ = require('lodash');

function MovieDetails({ 
    latestMovieDeletedInMovieDetails, 
    getOneMovie, 
    movieChangeLoadingBarProgressAction, 
    movieLoadingBarProgress,
    personLoadingBarProgress,
    personChangeLoadingBarProgressAction,
    getPersonList,
    arePersonsInStore,
    personSetDataInStoreTrueAction,
    persons,
    deleteMovie,
    getActors,
    moviesThatGotActors,
    actorsToDelete,
    deleteActor,
    addActor,
    changeDirector,
    allActors
}) {
    const { id } = useParams()
    const navigate = useNavigate()
    const movie = useSelector((state) => getMovieById(state, parseInt(id)))
    const [director, setDirector] = useState(persons.find(el => el.id === movie ? movie.director_id : ""))
    const actors_id_from_store = useSelector((state) => getActorsOfMovie(state, movie ? movie.id : undefined)).map(el => el.person_id)
    const [tookActorsFromDataBase, setTookActorsFromDataBase] = useState(false)
    const [actors_id, setActors_id] = useState([])
    const [actorsToAdd_id, setActorsToAdd_id] = useState([])
    const [valueSelectActors, setValueSelectActors] = useState(null);
    const [valueSelectDirector, setValueSelectDirector] = useState(null)
    const directorsOptionsWithIds = persons.filter(person => {
                                        return person.id !== (movie ? movie.director_id : undefined)
                                    })
                                    .map(person => ({value: person.id, label: `${person.first_name} ${person.last_name}`}))

    const actors = _.orderBy(
        [...persons.filter(person => actors_id.includes(person.id))], 
        ['first_name', 'last_name']
        )

    const [doNotHavePersonsOptionsWithIds, setdoNotHavePersonsOptionsWithIds] = useState(false)
    const [personsOptionsWithIds, setPersonsOptionsWithIds] = useState(
        persons
            .filter(person => {
                return actors_id.indexOf(person.id) === -1
            })
            .map(person => ({value: person.id, label: `${person.first_name} ${person.last_name}`}))
    )

    const handleDelete = async () => {
        //usuwanie aktorow najpierw
        await allActors.forEach(async el => {
            if(el.movie_id === parseInt(id)) {
                await deleteActor(id, el.person_id)
            }
        })

        deleteMovie(id).then(() => {
            navigate("/movies")
        })
    }

    const handleChangeOfActorsToAdd = (event) => {
        setValueSelectActors(event)
        setActorsToAdd_id([...event.map(el => el.value)])
    }

    const handleDeleteActors = () => {
        for (const actorId of actorsToDelete) {
            deleteActor(id, actorId).then(() => {
                setActors_id(lastActors_id => [...lastActors_id.filter(el => el !== actorId)])

                const newPersonInOptionsWithIds = persons.find(person => person.id === actorId)
                setPersonsOptionsWithIds(oldPersonsOptionsWithIds => [
                    ...oldPersonsOptionsWithIds,
                    {value: newPersonInOptionsWithIds.id, label: `${newPersonInOptionsWithIds.first_name} ${newPersonInOptionsWithIds.last_name}`}
                ])
            })
        }
    }

    const handleAddActors = () => {
        for (const actorId of actorsToAdd_id) {
            addActor(id, actorId).then((res) => {
                setActors_id(actors_id => [...actors_id, res.payload.person_id])
                setPersonsOptionsWithIds(oldPersonsOptions => oldPersonsOptions.filter(el => el.value !== actorId))
            })
        }
        setActorsToAdd_id([])
        setValueSelectActors(null)
    }

    const handleChangeDirectorToChange = (newValue) => {
        setValueSelectDirector(newValue)
    }

    const handleChangeDirector = async () => {
        if(valueSelectDirector !== null){
            await changeDirector(id, valueSelectDirector.value)
            setValueSelectDirector(null)
        }
    }

    const customStylesActors = {
        control: (base, state) => ({
            ...base,
            borderRadius: '0px',
            background: "hsl(230, 28%, 62%)",
            boxShadow: 'none',
            borderBottom: state.isFocused ? '1px solid #5858fe' : '1px solid black',
            borderTop: state.isFocused ? '1px solid #5858fe' : '0px',
            borderRight: state.isFocused ? '1px solid #5858fe' : '0px',
            borderLeft: state.isFocused ? '1px solid #5858fe' : '0px',
            "&:hover": {
            borderColor: state.isFocused ? "" : "orange"
            }
        }),
        multiValue: base => ({
            ...base,
            paddingLeft: 4,
            borderRadius: 5,
            background: '#444D7A',
            color: '#a3c0ff',
        }),
        multiValueRemove: (base, state) => ({
            ...base,
            fontSize: "18px",
            height: "20",
            "&:hover": {
                background: "#444D7A",
                color: "black"
                }
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#bfe0ff',
            fontSize: "20px"
        }),
        dropdownIndicator: base => ({
            ...base,
            color: "#bdbdbd",
            "&:hover": {
                color: "black"
            }
        }),
        clearIndicator: base => ({
            ...base,
            color: "#bdbdbd",
            "&:hover": {
                color: "black"
            }
        }),
        placeholder: (base) => ({
            ...base,
            fontSize: '20px',
            color: "#bfe0ff",
            fontWeight: 400,
        }),
        input: (base, state) => ({
            ...base,
            color: '##bfe0ff',
            fontSize: "20px"
        }),
        menu: base => ({
          ...base,
          // kill the gap
          marginTop: 0,
          background: "#D3D3D3",
          color: "#0037b1",
        }),
        menuList: base => ({
          ...base,
          padding: 0,
        })
      };

    const customStylesDirectors = {
        control: (base, state) => ({
            ...base,
            borderRadius: '0px',
            background: "hsl(230, 28%, 62%)",
            boxShadow: 'none',
            borderBottom: state.isFocused ? '1px solid #5858fe' : '1px solid black',
            borderTop: state.isFocused ? '1px solid #5858fe' : '0px',
            borderRight: state.isFocused ? '1px solid #5858fe' : '0px',
            borderLeft: state.isFocused ? '1px solid #5858fe' : '0px',
            "&:hover": {
            borderColor: state.isFocused ? "" : "orange"
            }
        }),
        singleValue: base => ({
            ...base,
            paddingLeft: 4,
            borderRadius: 5,
            color: '#bfe0ff',
            fontSize: '20px'
        }),
        multiValueRemove: (base, state) => ({
            ...base,
            fontSize: "18px",
            height: "20",
            "&:hover": {
                background: "#444D7A",
                color: "black"
            }
        }),
        singleValueLabel: (base) => ({
            ...base,
            color: '#bfe0ff',
            fontSize: "20px"
        }),
        dropdownIndicator: base => ({
            ...base,
            color: "#bdbdbd",
            "&:hover": {
                color: "black"
            }
        }),
        clearIndicator: base => ({
            ...base,
            color: "#bdbdbd",
            "&:hover": {
                color: "black"
            }
        }),
        placeholder: (base) => ({
            ...base,
            fontSize: '20px',
            color: "#bfe0ff",
            fontWeight: 400,
        }),
        input: (base, state) => ({
            ...base,
            color: '#bfe0ff',
            fontSize: "20px"
        }),
        menu: base => ({
            ...base,
            // kill the gap
            marginTop: 0,
            background: "#D3D3D3",
            color: "#0037b1",
        }),
        menuList: base => ({
            ...base,
            padding: 0,
        })
    };

    useEffect(() =>{
        //zeby te operacje niew wykonywaly sie zbyt duzo razy
        if (movie === undefined && latestMovieDeletedInMovieDetails !== parseInt(id)){
            //movie nie ma w store trzeba sprobwac pobrac z bazy danych
            getOneMovie(id)
        } else if (arePersonsInStore === false){
            getPersonList()
            personSetDataInStoreTrueAction()
        } else if (moviesThatGotActors.indexOf(id) === -1){
            getActors(id).then((el) => {
                setActors_id([...el.payload[0].map(el => el.person_id)])
                setTookActorsFromDataBase(true)
            })
        } else if (tookActorsFromDataBase === false) {
            setActors_id(actors_id_from_store)
            setTookActorsFromDataBase(true)
        } else if (doNotHavePersonsOptionsWithIds === false){
            setPersonsOptionsWithIds(
                persons
                    .filter(person => {
                        return actors_id.indexOf(person.id) === -1
                    })
                    .map(person => ({value: person.id, label: `${person.first_name} ${person.last_name}`}))
            )
            setdoNotHavePersonsOptionsWithIds(true)
        }

        if(movie !== undefined) {
            setDirector(persons.find(el => el.id === parseInt(movie.director_id)))
        }

    }, [
        movie, 
        getOneMovie, 
        id, 
        latestMovieDeletedInMovieDetails, 
        arePersonsInStore, 
        getPersonList, 
        personSetDataInStoreTrueAction, 
        getActors,
        moviesThatGotActors,
        tookActorsFromDataBase,
        actors_id_from_store,
        actors_id,
        persons,
        doNotHavePersonsOptionsWithIds
    ]);

    return (
        <div className='MovieDetailsBox'>
            <LoadingBar
                color='white'
                progress={movieLoadingBarProgress}
                onLoaderFinished={() => movieChangeLoadingBarProgressAction(0)}
            />
            <LoadingBar
                color='white'
                progress={personLoadingBarProgress}
                onLoaderFinished={() => personChangeLoadingBarProgressAction(0)}
            />
            <div className='aboutMovieBox'>
                <div className='aboutMovieAndButtonsBox'>
                    <div className='aboutMovieAndImageBox'>
                        <div className='imageBox'>
                            <img src={movie.image_url} alt="cover" />
                        </div>
                        <div className='aboutMovie'>
                            <p className="title">{movie ? movie.title : ""}</p>
                            <p className="genre">
                                <span>Genre:</span>
                                {movie ? movie.genre : ""}
                            </p>
                            <Link className="directorBox" to={`/persons/${movie ? movie.director_id : ""}`}>
                                <span className='director'>Director:</span>
                                <span className='first_name'>{director ? director.first_name : "Empty"}</span>
                                <span className='last_name'>{director ? director.last_name : ""}</span>
                            </Link>
                            <p className="release_date">
                                <span>Date release:</span> 
                                {movie ? movie.release_date.substr(0,10) : ""}
                            </p>
                        </div>
                    </div>
                    <div className='buttonsBox'>
                        <Link to={`/movies/form/${id}`} className='editLink'>Edit Movie</Link>
                        <button type='button' className='deleteButton' onClick={() => handleDelete()}>Delete Movie</button>
                    </div>
                </div>
                <div className='descriptionBox'>
                    <div className='description'>
                        {movie ? movie.description : ""}
                    </div>
                </div>
            </div>
            <div className='changeDirectorBox'>
                <div className='selectDirectorBox'>
                    <p className='selectDirectorP'>Select new director:</p>
                    <Select
                        isClearable
                        name="directors"
                        options={directorsOptionsWithIds}
                        value={valueSelectDirector}
                        className="directorsSelect"
                        styles={customStylesDirectors}
                        placeholder="Select..."
                        onChange={handleChangeDirectorToChange}
                    />
                </div>
                <div className='changeDirectorButtonBox'>
                    <button type='button' onClick={handleChangeDirector}>Change director</button>
                </div>
            </div>
            <div className='actorsAndAddActorsBox'>
                
                <div className='actors'>
                    <div className='actorsPAndDelete'>
                        <p className='actorsP'>Actors:</p>
                        <button type='button' onClick={handleDeleteActors} >Delete</button>
                    </div>
                    {
                        actors.map(actor =>
                            <OneActor key={actor.id} id={actor.id} first_name={actor.first_name} last_name={actor.last_name} />
                        )
                    }
                </div>
                <div className='addActorsAndButtonBox'>
                    <div className='addActorsBox'>
                            <p className='addActorsP'>Select Actors to add:</p>
                            <Select
                                isMulti
                                name="actors"
                                options={personsOptionsWithIds}
                                value={valueSelectActors}
                                className="actorsSelect"
                                styles={customStylesActors}
                                placeholder="Select..."
                                onChange={handleChangeOfActorsToAdd}
                            />
                    </div>
                    <div className='addActorsButton'>
                            <button type='button' onClick={handleAddActors}>Add actors</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    
    return {
        latestMovieDeletedInMovieDetails: getLatestMovieDeletedInMovieDetails(state),
        movieLoadingBarProgress: getMovieLoadingBarProgress(state),
        personLoadingBarProgress: getPersonLoadingBarProgress(state),
        persons: getPersons(state),
        arePersonsInStore: getPersonDataInStore(state),
        moviesThatGotActors: getMoviesGotActors(state),
        actorsToDelete: getActorsToDelete(state),
        allActors: getAllActors(state)
    };
}

const mapDispatchToProps = {
    getOneMovie,
    movieChangeLoadingBarProgressAction,
    personChangeLoadingBarProgressAction,
    getPersonList,
    personSetDataInStoreTrueAction,
    deleteMovie,
    getActors,
    deleteActor,
    addActor,
    changeDirector
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieDetails);
