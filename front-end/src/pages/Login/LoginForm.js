import React from 'react';
import { useState } from 'react';
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR } from '../../modules/auth/actions';
import MakeAsyncFunction from 'react-redux-promise-listener'
import { promiseListener } from '../../store'

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from 'mui-rff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const isRequired = value => (value ? undefined : 'Required');

const isValidEmail = email => (
    (email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) ? undefined : 'Enter a valid email address.'
);

const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

/*
const validate = (values) => {
    const errors = {}
    if (!values.email) {
        errors.email = 'Email required.';
    }
    if (!values.password) {
        errors.password = 'Password required.';
    }
    if ( values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) ) {
        errors.email = 'Enter a valid email address.';
    }

    return errors;
}
*/

const SubmitError = ({ name }) => (
    <Field
        name={name}
        subscription={{ submitError: true, dirtySinceLastSubmit: true }}
    >
        {({ meta: { submitError, dirtySinceLastSubmit } }) =>
            submitError && !dirtySinceLastSubmit ? <span>{submitError}</span> : null
        }
    </Field>
);

const LoginForm = ({subscription}) => {

    /*
    const initialValues = {
        email: undefined,
        password: undefined,
        showPassword: false
    };
    */

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    /*
    const onSubmit = async (values) => {

        alert(JSON.stringify(values, 0, 2));

        //props.signin(values, () => {
        //    props.history.push('/overview'); // redirect to the Overview page
        //});
        
    };
    */

    return (
        <MakeAsyncFunction
            listener={promiseListener}
            start={LOGIN_USER}
            resolve={LOGIN_USER_SUCCESS}
            reject={LOGIN_USER_ERROR}
        >
            {onSubmit => (
                <Form
                    onSubmit={onSubmit}
                    //initialValues={submittedValues ? submittedValues : initialValues}
                    // validate={validate}
                    subscription={subscription}
                    render={
                        ({ submitError, handleSubmit, form, submitting, pristine, values }) => (
                        <form noValidate={true} autoComplete="off" onSubmit={handleSubmit}>
                            <Box ml={3} mr={3}>
                                <Typography variant="h5">Email</Typography>
                            </Box>
                            <Box mt={1} ml={3} mr={3} mb={1}>
                                <Field name="email" validate={composeValidators(isRequired, isValidEmail)} >
                                    {props => (
                                        <TextField
                                            id="email"
                                            name="email"
                                            placeholder="Email Address" 
                                            variant="outlined" 
                                            fullWidth
                                        />
                                    )}
                                </Field>
                                <SubmitError name="email" />
                            </Box>
                            <Box mt={4} ml={3} mr={3}>
                                <Typography variant="h5">Password</Typography>
                            </Box>                            
                            <Box mt={1} ml={3} mr={3} mb={3}>
                                <Field name="password" validate={isRequired}>
                                    {props => (
                                        <TextField id="password" name="password" placeholder="Password" variant="outlined" fullWidth
                                            type={showPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment:
                                                <InputAdornment position="end" >
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }} 
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="center" mt={7} ml={3} mr={3} mb={3}>
                                <Button type="submit" variant="contained" color="primary" fullWidth size="large" height="50px" disabled={submitting}>
                                    Sign In
                                </Button>
                            </Box>
                            {submitError && <div>{submitError}</div>}
                        </form>
                    )}
                />
            )}
        </MakeAsyncFunction>
    );
}

export default LoginForm;