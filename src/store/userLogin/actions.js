import TYPES from './types';

export const setLogin = () => {
  return (dispatch) => {
    dispatch({type: TYPES.SET_LOGIN});
  };
};

export const clearLogin = () => {
  return (dispatch) => {
    dispatch({type: TYPES.CLEAR_LOGIN});
  };
};
