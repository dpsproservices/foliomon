export const actionTypes = {
  SET_ACCOUNT: 'SET_ACCOUNT'
};

export const setSelectedAccount = accountId => ({
  type: actionTypes.SET_ACCOUNT,
  payload: { accountId }
});