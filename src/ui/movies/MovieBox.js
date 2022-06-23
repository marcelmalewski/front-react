import { useEffect } from "react";
import { connect } from "react-redux";
import LoadingBar from 'react-top-loading-bar'
import { getMovieList } from "../../ducks/movies/operations";
import { getMovieLoading, getMovieError, getMovieDataInStore, getMovieLoadingBarProgress } from "../../ducks/movies/selectors";
import MovieFilters from "./MovieFilters";
import MovieList from "./MovieList";
import './MovieBox.scss'
import { movieSetDataInStoreTrueAction, movieChangeLoadingBarProgressAction } from "../../ducks/movies/actions";
import { getPersonList } from "../../ducks/persons/operations";
import { getPersonLoadingBarProgress } from "../../ducks/persons/selectors";
import { personChangeLoadingBarProgressAction, personSetDataInStoreTrueAction } from "../../ducks/persons/actions";

const MovieBox = ({ 
    error, 
    loading, 
    dataInStore, 
    getMovieList, 
    movieSetDataInStoreTrueAction, 
    movieLoadingBarProgress, 
    movieChangeLoadingBarProgressAction,
    getPersonList,
    personLoadingBarProgress,
    personChangeLoadingBarProgressAction,
    personSetDataInStoreTrueAction
} ,props) => {

    //pobieramy dany tylko raz i przy odswierzeniu strony 
    useEffect(() => {
        if(dataInStore === false) {
            getMovieList()
            movieSetDataInStoreTrueAction()
            //zeby mozna bylo wczytywac dyrektorow
            getPersonList()
            personSetDataInStoreTrueAction()   
        }
    }, [getMovieList, dataInStore, movieSetDataInStoreTrueAction, getPersonList, personSetDataInStoreTrueAction]);

    return (
        <div className='MovieAndLoadingBox'>
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
            {error
                ? <div>{error.toString()}</div>
                : loading
                ? <div className='loading'>Loading...</div>
                : <div className='MovieBox' >
                    <MovieFilters />
                    <MovieList />
                  </div> 
            }
            
        </div>
    )
};
const mapStateToProps = (state) => {
    return {
        loading: getMovieLoading(state),
        error: getMovieError(state),
        dataInStore: getMovieDataInStore(state),
        movieLoadingBarProgress: getMovieLoadingBarProgress(state),
        personLoadingBarProgress: getPersonLoadingBarProgress(state)
    };
}
const mapDispatchToProps = {
    getMovieList,
    movieSetDataInStoreTrueAction,
    movieChangeLoadingBarProgressAction,
    getPersonList,
    personChangeLoadingBarProgressAction,
    personSetDataInStoreTrueAction
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieBox);