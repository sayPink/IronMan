import { combineReducers } from 'redux';
import ContactReducer from './music';
import Blog from './blog';

const reducers = {
  contactStore: ContactReducer,
  blog: Blog
}

const rootReducer = combineReducers(reducers);

export default rootReducer;