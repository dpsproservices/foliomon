import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../redux/auth/actions';

class SignUp extends Component {
    onSubmit = formProps => {
        this.props.signup(formProps, () => {
            this.props.history.push('/overview'); // redirect to the Overview page
        });
    };

    renderErrorMessage() {
        if(this.props.errorMessage) {
            return (
                <div className="alert alert-danger">{this.props.errorMessage}</div> 
            );
        } else {
            return (
                <div></div>
            );
        }
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset>
                    <label>Email</label>
                    <Field
                        name="email"
                        type="text"
                        component="input"
                        autoComplete="none"
                    />
                </fieldset>
                <fieldset>
                    <label>Password</label>
                    <Field
                        name="password"
                        type="password"
                        component="input"
                        autoComplete="none"
                    />
                </fieldset>
                {this.renderErrorMessage()}
                <button>Sign Up</button>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.errorMessage };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signup' })
)(SignUp);