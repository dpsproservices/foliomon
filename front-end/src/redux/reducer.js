import { actionTypes } from './actions';

const initialState = {
  accountId: null
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_ACCOUNT: {
      const { accountId } = action.payload;
      return { ...state, accountId };
    }
  }
  return state;
}
  