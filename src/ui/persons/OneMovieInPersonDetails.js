import React, { useEffect, useState } from 'react'
import { connect, useSelector } from "react-redux";
import './OneMovieInPersonDetails.scss'
import { Link } from 'react-router-dom';
import { getDirectorOfMovie } from '../../ducks/movies/selectors';
import { getActors } from '../../ducks/movies/operations';
import { getOnePerson } from '../../ducks/persons/operations';

function OneMovieInPersonDetails({
    id, 
    title, 
    release_date, 
    image_url, 
    director_id, 
    genre,
    getOnePerson
}) {
    const director = useSelector((state) => getDirectorOfMovie(state, director_id))
    const [gotDirectorFromDataBase, setGotDirectorFromDataBase] = useState(false)

    useEffect(() => {
        if(gotDirectorFromDataBase === false){
            if(director_id !== null && director === undefined) getOnePerson(director_id)                                         
            setGotDirectorFromDataBase(true)
        }
    }, [director_id, getOnePerson, gotDirectorFromDataBase, director])

    return (
        <div className='movieInPersonBox'>
            <div className='imageBox'>
                {/* https://i.pinimg.com/236x/3e/ed/1a/3eed1afe9f310b3b61588f0e34f821f1.jpg */}
                <img src={image_url} alt="cover" />

            </div>

            <div className='detailsBox'>
                <Link className='aboutMovie' to={`/movies/${id}`}>
                    <p className='title'>{title}</p>
                    <p className='director'>
                        <span>Director:</span> {director ? `${director.first_name} ${director.last_name}` : "Empty"}
                    </p>
                    <p className='genre'>
                        <span>Genre:</span> {genre}
                    </p>
                    <p className='release_date'>
                        <span>Release date:</span> {release_date === undefined ? '' : release_date.substring(0,10)}
                    </p>
                </Link>
            </div>
            
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        
    };
}

const mapDispatchToProps = {
    getActors,
    getOnePerson
}

export default connect(mapStateToProps, mapDispatchToProps)(OneMovieInPersonDetails);