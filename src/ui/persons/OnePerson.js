import React from 'react'
import { connect } from "react-redux";
import './OnePerson.scss'
import { Link } from 'react-router-dom';
import { BsTrash, BsTrashFill } from "react-icons/bs";
import { personAddToDeleteAction, personRemoveFromToDeleteAction } from '../../ducks/persons/actions';

function OnePerson({id, first_name, last_name, personAddToDeleteAction, personRemoveFromToDeleteAction}) {

    const handleCheck = (event) => {
        const value = event.target.checked
        const name = parseInt(event.target.name) // id of person

        //dodawanie i uswanie z setToDelete
        if(value) personAddToDeleteAction(name)
        else personRemoveFromToDeleteAction(name)
    }

    return (
        <div className='personBox'>
            <Link className='aboutPerson' to={`/persons/${id}`}>
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
    personAddToDeleteAction,
    personRemoveFromToDeleteAction
}

export default connect(null, mapDispatchToProps)(OnePerson);
