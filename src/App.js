import './App.scss';
import Navbar from './ui/core/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './ui/core/Home';
import PersonBox from './ui/persons/PersonBox';
import PersonForm from './ui/persons/PersonForm';
import PersonDetails from './ui/persons/PersonDetails';
import MovieBox from './ui/movies/MovieBox';
import MovieForm from './ui/movies/MovieForm';
import MovieDetails from './ui/movies/MovieDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* NIE jest pobieranie osob gdy pusty store NIE RESPONSYWNY*/}
          <Route path="/" element={<Home />} />
          {/* TAK jest pobieranie osob gdy pusty store TAK RESPONSYWNY*/}
          <Route path="persons" element={<PersonBox />}/> 
          {/* TAK jest pobieranie osob gdy pusty store TAK RESPONSYWNY*/}
          <Route path="persons/:id" element={<PersonDetails />} />
          {/* TAK jest pobieranie osob gdy pusty store TAK RESPONSYWNY*/}
          <Route path="persons/form" element={<PersonForm />}/>
          <Route path="persons/form/:id" element={<PersonForm />}/>
          {/* TAK pobieranie osob gdy pusty store TAK RESPONSYWNY*/}
          <Route path="movies" element={<MovieBox />} />
          {/* TAK pobieranie osob gdy pusty store TAK RESPONSYWNY*/}
          <Route path="movies/form" element={<MovieForm />} />
          <Route path="movies/form/:id" element={<MovieForm />} />
          {/* TAK pobieranie osob gdy pusty store TAK RESPONSYWNY*/}
          <Route path="movies/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
