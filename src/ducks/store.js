import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import { personReducer } from './persons/reducer';
import { createMiddleware } from 'redux-api-middleware';
import { movieReducer } from './movies/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
    persons: personReducer,
    movies: movieReducer
  });

const store = createStore(combinedReducers, 
  composeEnhancers(applyMiddleware(thunk, createMiddleware(), logger)),
  );

  export default store;