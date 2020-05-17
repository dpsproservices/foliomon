import {
  SET_ACCOUNT
} from './actions';

const initialState = {
  accountId: null,
  errorMessage: null
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT: {
      const { accountId } = action.payload;
      localStorage.removeItem('accountId');
      localStorage.setItem('accountId', accountId);
      return { ...state, accountId };
    }
    default:
      return state;    
  }
};

export default accountReducer;