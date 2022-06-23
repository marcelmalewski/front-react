import React from 'react'
import { connect } from "react-redux";
import './OneActor.scss'
import { Link } from 'react-router-dom';
import { BsTrash, BsTrashFill } from "react-icons/bs";
import { actorAddToDeleteAction, actorRemoveFromToDeleteAction } from '../../ducks/movies/actions';

function OneActor({id, first_name, last_name, actorAddToDeleteAction, actorRemoveFromToDeleteAction}) {

    const handleCheck = (event) => {
        const value = event.target.checked
        const name = parseInt(event.target.name) // usuwanie aktorow

        //dodawanie i uswanie z setToDelete
        if(value) actorAddToDeleteAction(name)
        else actorRemoveFromToDeleteAction(name)
    }

    return (
        <div className='actorBox'>
            <Link className='aboutActor' to={`/persons/${id}`}>
                <p className='firstName'>{first_name}</p>
                <p className='lastName'>{last_name}</p>
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
    )
}

const mapDispatchToProps = {
    actorAddToDeleteAction,
    actorRemoveFromToDeleteAction
}

export default connect(null, mapDispatchToProps)(OneActor);