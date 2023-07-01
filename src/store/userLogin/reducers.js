import TYPES from './types';

export default function userLoginReducer(state = false, action) {
  switch (action.type) {
    case TYPES.SET_LOGIN:
      return true;
    case TYPES.CLEAR_LOGIN:
      return false;
    default:
      return state;
  }
}
