import greyScreenReducer from './ui/grey_screen_reducer';
import dropdownReducer from './ui/dropdown_reducer';
import {combineReducers} from 'redux';

export default combineReducers({
  greyScreen:greyScreenReducer,
  dropdown:dropdownReducer
});
