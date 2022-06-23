import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { getPersonNameFilter, getPersons, getPersonsToDelete } from "../../ducks/persons/selectors";
import { Link } from 'react-router-dom';
import './PersonList.scss'
import OnePerson from "./OnePerson";
import { deletePerson, sortPersons } from "../../ducks/persons/operations";
import { getPersonCountryFilters, getPersonPeriodFilter } from '../../ducks/persons/selectors';
import { getAllActors, getMovies, getMoviesGotActors } from "../../ducks/movies/selectors";
import { deleteActor, editMovie, getActors } from "../../ducks/movies/operations";

const PersonList = ({ 
    actors, 
    periodFilter,
    countryFilters,
    persons, 
    personsToDelete, 
    deletePerson, 
    sortPersons, 
    movies,
    moviesGotActors,
    getActors,
    nameFilter,
    deleteActor,
    editMovie
} ,props) => {
    const [filteredPersons, setFilteredPersons] = useState([])

    const handleDelete = async () => {
        //idze po array i po kolei personDelete na kazdym
        for (const personId of personsToDelete) {
            //najpierw usuwanie go jako aktor z filmow
            await actors.forEach(async el => {
                if(el.person_id === personId) {
                    await deleteActor(el.movie_id, personId)
                }
            })

            await movies.forEach( async el => {
                if(el.director_id === parseInt(personId)){
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
            
            await deletePerson(personId)
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
        if(event.target.value === 'Moviesup' || event.target.value === 'Moviesdown'){
            const numbersOfMovies= groupBy(actors, "person_id")
            const actorsWithNumberOfMovies = persons.map(el =>
                ({...el, number_of_movies: numbersOfMovies[el.id] ? numbersOfMovies[el.id] : 0})
            )

            sortPersons(actorsWithNumberOfMovies, event.target.value)
        } else {
            sortPersons(persons, event.target.value)
        }
    }

    useEffect(() => {
        setFilteredPersons([
            ...persons.filter(person => {
                let result = true
                if(countryFilters.length !== 0){
                    if (countryFilters.includes(person.nationality) === false) result = false
                }

                if(periodFilter !== ""){
                    const startYear = parseInt(periodFilter.split("-")[0])
                    const endYear = parseInt(periodFilter.split("-")[1])
                    const birth_date_year = parseInt(person.birth_date.split("-")[0])
                    if((startYear <= birth_date_year && birth_date_year <= endYear) === false) result = false
                }

                if (nameFilter !== ""){
                    const nameRegex = new RegExp('^' + nameFilter.toLowerCase())
                    if (nameRegex.test(person.first_name.toLowerCase() + ' ' + person.last_name.toLowerCase()) === false) result = false
                }

                return result
            })
        ])

        movies.forEach(movie => {
            if(moviesGotActors.indexOf(movie.id) === -1) getActors(movie.id)
        })

    }, [persons, countryFilters, movies, moviesGotActors, getActors, periodFilter, nameFilter]);

    return (
        <div className='ListOfPersons'>
            <div className='TitleAndAddBox'>
                <p className='pPersons'>Persons</p>
                <Link className='LinkAddAndEditPerson' to='/persons/form'><p className='pAdd'>Add person</p></Link>
            </div>

            {/* form  zebye deletowac books*/}
            <form>
                <div className='SortAndDelete'>
                    <div className="choose">
                        <p className='pSort'>Sort: </p>
                        <select className="options" onChange={(event) =>  handleChangeSortType(event)}>
                            <option value='Aup'>Alphabetically ascending</option>
                            <option value='Adown'>Alphabetically descending</option>
                            <option value='Dup'>Birth date ascending</option>
                            <option value='Ddown'>Birth date descending</option>
                            {/* trzecie będzie wedlug ilosc filmow w jakich zagral */}
                            <option value='Moviesup'>Number of movies played ascending</option>
                            <option value='Moviesdown'>Number of movies played descending</option>
                        </select>
                    </div>
                    <button type='button' onClick={handleDelete}>Delete</button>
                </div>
                
                {filteredPersons
                    .map(person =>
                        <OnePerson key={person.id} id={person.id} first_name={person.first_name} last_name={person.last_name} />
                    )
                }
            </form>
        </div>
    )
};
const mapStateToProps = (state) => {
    return {
        persons: getPersons(state),
        personsToDelete: getPersonsToDelete(state),
        countryFilters: getPersonCountryFilters(state),
        periodFilter: getPersonPeriodFilter(state),
        nameFilter: getPersonNameFilter(state),
        actors: getAllActors(state),
        movies: getMovies(state),
        moviesGotActors: getMoviesGotActors(state)
    };
}

const mapDispatchToProps = {
    deletePerson,
    sortPersons,
    getActors,
    deleteActor,
    editMovie
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonList);