import {RECEIVE_ITEM,RECEIVE_ITEMS,RECEIVE_EDIT_ITEM} from '../../actions/item_actions';
import {LOGOUT_CURRENT_USER} from '../../actions/session_actions';
import {RECEIVE_USER} from '../../actions/user_actions';
import {merge} from 'lodash';

export default (state={}, action)=>{
  Object.freeze(state);

  let newState = merge({}, state);
  switch(action.type){
    case RECEIVE_EDIT_ITEM:
      return {[action.payload.item.id]:action.payload.item};
    case RECEIVE_ITEMS:
      return action.payload.items;
    case RECEIVE_ITEM:
      return merge(action.payload.items,
          {[action.payload.item.id]:action.payload.item});
    case RECEIVE_USER:
      return merge(newState,action.payload.items) || {};//merge(newState, {[action.user.id]:action.user});
    case LOGOUT_CURRENT_USER:
      return state;
    default:
      return state;
  }
};
