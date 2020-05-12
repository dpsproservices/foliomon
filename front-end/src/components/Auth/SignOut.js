import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/auth/actions';

class SignOut extends Component {
    componentDidMount() {
        this.props.signout();
    }

    render() {
        return <div>You are logged out.</div>;
    }
}

export default connect(null, actions)(SignOut);