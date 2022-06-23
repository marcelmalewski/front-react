import React, { useState, useEffect } from 'react'
import './MovieFilters.scss'
import { connect } from "react-redux";
import Select from 'react-select';
import { sendGenreFilter } from '../../ducks/movies/operations';
import { getAllDirectorsId, getMovieDirectorFilter, getMovieGenreFilters, getMovieTitleFilter } from '../../ducks/movies/selectors';
import { getPersons } from '../../ducks/persons/selectors';
import { changeDirectorFilterAction, changeTitleFilterAction } from '../../ducks/movies/actions';

function MovieFilters({ 
    genreFilters, 
    sendGenreFilter, 
    directorsId, 
    persons, 
    changeDirectorFilterAction, 
    changeTitleFilterAction,
    directorFilter,
    titleFilter
}) {
    const directorsOptions = persons.filter(el => directorsId.includes(el.id))
                                    .map(person => ({value: person.id, label: `${person.first_name} ${person.last_name}`}))
    const [directorValue, setDirectorValue] = useState('')
    const [savedDirectorValueLoaded, setSavedDirectorValueLoaded] = useState(false)
    const [savedGenreValueLoaded, setSavedGenreValueLoaded] = useState(false)
    const [titleFilterValue, setTitleFilterValue] = useState(titleFilter)

    const genres = [
        { key: 'Action', value: 'Action'},
        { key: 'Drama', value: 'Drama'},
        { key: 'Romance', value: 'Romance'},
        { key: 'History', value: 'History'},
        { key: 'Fantasy', value: 'Fantasy'},
        { key: 'Religion', value: 'Religion'},
        { key: 'Mystery', value: 'Mystery'},
        { key: 'Horror', value: 'Horror'},
        { key: 'Thriller', value: 'Thriller'},
        { key: 'Biographie', value: 'Biographie'},
        { key: 'Comedy', value: 'Comedy'},
        { key: 'Science', value: 'Science'},
        { key: 'Travel', value: 'Travel'}
    ]

    const handleFiltersChange = (filter) => {
        sendGenreFilter(filter, genreFilters)
    }

    const handleChangeOfDirectorFilter = (filter) => {
        setDirectorValue(filter)
        changeDirectorFilterAction(filter.value)
    }

    const handleClearDirectorFilter = () => {
        setDirectorValue(null)
        changeDirectorFilterAction(null)
    }

    const handleTitleFilterOnChange = (event) => {
        setTitleFilterValue(event)
        changeTitleFilterAction(event)
    }

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: '0px',
            background: "#444D7A",
            borderBottom: state.isFocused ? '0px' : '1px solid black',
            borderTop: '0px',
            borderRight: '0px',
            borderLeft: '0px',
            "&:hover": {
            borderColor: state.isFocused ? "blue" : "orange"
            }
        }),
        singleValue: base => ({
            ...base,
            paddingLeft: 4,
            borderRadius: 5,
            background: '#444D7A',
            color: '#a3c0ff',
            fontSize: "20px"
        }),
        dropdownIndicator: base => ({
            ...base,
            color: "#bdbdbd"
        }),
        clearIndicator: base => ({
            ...base,
            color: "#bdbdbd"
        }),
        placeholder: (base) => ({
            ...base,
            fontSize: '20px',
            color: "#a3c0ff",
            fontWeight: 400,
        }),
        input: (base, state) => ({
            ...base,
            color: '#a3c0ff'
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

    useEffect(() => {
        if(savedDirectorValueLoaded === false && persons.length !== 0){
            if(directorFilter !== null){
                let director = persons.find(el => el.id === directorFilter)
                director = {value: director.id, label: `${director.first_name} ${director.last_name}`}
                setDirectorValue(director)
            }

            setSavedDirectorValueLoaded(true)
        }

        if(savedGenreValueLoaded === false){
            const checkBoxes = document.getElementsByName('genreFilters')
            checkBoxes.forEach(el => {
                if(genreFilters.includes(el.value)){
                    el.checked = true
                }
            })

            setSavedGenreValueLoaded(true)
        }
    }, [
        directorFilter, 
        persons,
        savedDirectorValueLoaded, 
        genreFilters,
        savedGenreValueLoaded
    ]);

    return (
        <div className='FiltersBox'>
            <form onChange={(event) => handleFiltersChange(event.target.value)}>
                <div className='TitleAndClearBox'>
                    <p className='pFilters'>Filters</p>
                </div>
                <p className='filterP'>Genre filters:</p>
                <div className='fGenres'>
                        {genres.map(genre =>
                            <div className='oneGenre' key={genre.key} >
                                <input type='checkbox' id={genre.value} value={genre.value} name='genreFilters'/>
                                <label htmlFor={genre.value}>
                                    {genre.key}
                                </label>
                            </div>
                        )}
                </div>
            </form>
            <div className='selectDirector'>
                <div className='label'>
                    <p className='directorFilterP'>Director filter:</p>
                    <button onClick={handleClearDirectorFilter}>Clear</button>
                </div>
                
                <Select
                    name="directors"
                    options={directorsOptions}
                    value={directorValue}
                    className="directorsSelect"
                    styles={customStyles}
                    placeholder="Select..."
                    onChange={handleChangeOfDirectorFilter}
                />
            </div>
            <p className='filterP'>Filter by title:</p>
            <input 
                name="titleFilter" 
                onChange={(event) => handleTitleFilterOnChange(event.target.value)}
                value={titleFilterValue}
                placeholder="Type title..."
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        genreFilters: getMovieGenreFilters(state),
        directorsId: getAllDirectorsId(state),
        persons: getPersons(state),
        directorFilter: getMovieDirectorFilter(state),
        titleFilter: getMovieTitleFilter(state)
    };
}

const mapDispatchToProps = {
    sendGenreFilter,
    changeDirectorFilterAction,
    changeTitleFilterAction
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieFilters);
