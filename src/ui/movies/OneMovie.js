import React, { useEffect } from 'react'
import { connect, useSelector } from "react-redux";
import './OneMovie.scss'
import { Link } from 'react-router-dom';
import { BsTrash, BsTrashFill } from "react-icons/bs";
import { movieAddToDeleteAction, movieRemoveFromToDeleteAction } from '../../ducks/movies/actions';
import { getDirectorOfMovie, getMoviesGotActors } from '../../ducks/movies/selectors';
import { getActors } from '../../ducks/movies/operations';

function OneMovie({
    id, 
    title, 
    release_date, 
    image_url, 
    director_id, 
    genre, 
    movieAddToDeleteAction, 
    movieRemoveFromToDeleteAction,
    moviesGotActors,
    getActors,
}) {
    const director = useSelector((state) => getDirectorOfMovie(state, director_id))

    const handleCheck = (event) => {
        const value = event.target.checked
        const name = parseInt(event.target.name) // id of movie

        //dodawanie i uswanie z setToDelete
        if(value) movieAddToDeleteAction(name)
        else movieRemoveFromToDeleteAction(name)
    }

    useEffect(() => {
        //pobrani aktorzy beda potrzebni do sortowania
        if (moviesGotActors.indexOf(id) === -1){
            getActors(id)
        }
    }, [getActors, id, moviesGotActors])

    return (
        <div className='movieBox'>
            <div className='imageBox'>
                <img src={image_url} alt="cover" />

            </div>

            <div className='detailsAndButtonBox'>
                <Link className='aboutMovie' to={`/movies/${id}`}>
                    <p className='title'>{title}</p>
                    <p className='director'>
                        <span>Director:</span> {director ? `${director.first_name} ${director.last_name}` : "Empty"}
                    </p>
                    <p className='genre'>
                        <span>Genre:</span> {genre}
                    </p>
                    <p className='release_date'>
                        <span>Release date:</span> {release_date ? release_date.substring(0,10) : ''}
                    </p>
                </Link>
                <div className='inputBox'>
                    <div className="deleteBox">
                        <input 
                            type='checkbox' 
                            name={id} 
                            id={id}
                            onChange={handleCheck}
                        />
                        <label htmlFor={id}>
                            <BsTrash className='emptyTrash'/>
                            <BsTrashFill className='filledTrash'/> 
                        </label>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        moviesGotActors: getMoviesGotActors(state),
    };
}

const mapDispatchToProps = {
    movieAddToDeleteAction,
    movieRemoveFromToDeleteAction,
    getActors
}

export default connect(mapStateToProps, mapDispatchToProps)(OneMovie);
