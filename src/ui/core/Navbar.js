import React from 'react'
import './Navbar.scss'
import { Link } from 'react-router-dom'
import { BiMoviePlay } from "react-icons/bi";

function Navbar() {
    return (
        <div className="NavbarBox" >
            <div className='IconBox' >
                <h1 className='Icon'> <BiMoviePlay /> </h1>
                <h1 className='Text'> <span>Movie</span>Page.pl </h1>
            </div>
            <div className='Navbar'>
                <Link className='Link Link1' to="persons">Persons</Link>
                <Link className='Link Link2' to='movies'>Movies</Link>
            </div>
        </div>
    )
}

export default Navbar