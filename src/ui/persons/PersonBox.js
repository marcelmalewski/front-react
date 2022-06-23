import { useEffect } from "react";
import { connect } from "react-redux";
import LoadingBar from 'react-top-loading-bar'
import { getPersonList } from "../../ducks/persons/operations";
import { getPersonLoading, getPersonError, getPersonDataInStore, getPersonLoadingBarProgress } from "../../ducks/persons/selectors";
import PersonFilters from "./PersonFilters";
import PersonList from "./PersonList";
import './PersonBox.scss'
import { personSetDataInStoreTrueAction, personChangeLoadingBarProgressAction } from "../../ducks/persons/actions";
import { getMovieLoadingBarProgress } from "../../ducks/movies/selectors";
import { movieChangeLoadingBarProgressAction, movieSetDataInStoreTrueAction } from "../../ducks/movies/actions";
import { getMovieList } from "../../ducks/movies/operations";

const PersonBox = ({ 
    error, 
    loading, 
    dataInStore, 
    getPersonList, 
    personSetDataInStoreTrueAction, 
    personLoadingBarProgress, 
    personChangeLoadingBarProgressAction,
    movieLoadingBarProgress,
    movieChangeLoadingBarProgressAction,
    getMovieList,
    movieSetDataInStoreTrueAction
} ,props) => {

    useEffect(() => {
        if(dataInStore === false) {
            getPersonList()
            personSetDataInStoreTrueAction()
            //potrzebuje filmow zeby pobrac aktorow zebe sortowac w ilu filmach gral aktor
            getMovieList()
            movieSetDataInStoreTrueAction()
        }

        
    }, [getPersonList, dataInStore, personSetDataInStoreTrueAction, getMovieList, movieSetDataInStoreTrueAction]);

    return (
        <div className='PersonAndLoadingBox'>
            <LoadingBar
                color='white'
                progress={personLoadingBarProgress}
                onLoaderFinished={() => personChangeLoadingBarProgressAction(0)}
            />
            <LoadingBar
                color='white'
                progress={movieLoadingBarProgress}
                onLoaderFinished={() => movieChangeLoadingBarProgressAction(0)}
            />
            {error
                ? <div>{error.toString()}</div>
                : loading
                ? <div className='loading'>Loading...</div>
                : <div className='PersonBox' >
                    <PersonFilters />
                    <PersonList />
                  </div> 
            }
            
        </div>
    )
};
const mapStateToProps = (state) => {
    return {
        loading: getPersonLoading(state),
        error: getPersonError(state),
        dataInStore: getPersonDataInStore(state),
        personLoadingBarProgress: getPersonLoadingBarProgress(state),
        movieLoadingBarProgress: getMovieLoadingBarProgress(state)
    };
}
const mapDispatchToProps = {
    getPersonList,
    personSetDataInStoreTrueAction,
    personChangeLoadingBarProgressAction,
    movieChangeLoadingBarProgressAction,
    getMovieList,
    movieSetDataInStoreTrueAction
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonBox);