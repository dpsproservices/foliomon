import React from 'react';
import { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux';
import { LOGOUT_USER, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR } from '../../modules/auth/actions';

// const mapStateToProps = state => {
//   return {
//     authenticated: state.auth.authenticated,
//     errorMessage: state.auth.errorMessage
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return bindActionCreators({ LOGOUT_USER }, dispatch);
// };
 
const Logout = (props) => {

  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect( () => {
    props.dispatch({
      type: LOGOUT_USER
    });
  }, []);

  return (
    <Redirect to="/login" />
  );
}

//export default connect(mapStateToProps, mapDispatchToProps)(Logout);
//export default connect(mapStateToProps, null)(Logout);
export default connect()(Logout);