// https://redux.js.org/api/combinereducers

import { combineReducers } from 'redux';
import {appReducer} from '../store/reducer/appReducer';

const reducers = {
  appReducer
};

export default combineReducers(reducers);