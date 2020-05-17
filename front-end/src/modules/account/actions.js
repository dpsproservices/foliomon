/* ======================================================================
Account Action Types
====================================================================== */

export const SET_ACCOUNT = 'SET_ACCOUNT';

export const setSelectedAccount = accountId => ({
  type: SET_ACCOUNT,
  payload: { accountId }
});