import React, { useEffect } from 'react';
import { useState } from 'react';
import { Redirect } from "react-router";
import { connect } from 'react-redux';
//import { Form } from 'react-final-form';
import { Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR } from '../../modules/auth/actions';
import MakeAsyncFunction from 'react-redux-promise-listener';
import { promiseListener } from '../../store';
import Box from '@material-ui/core/Box';
//import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from 'mui-rff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import MuiAlert from '@material-ui/lab/Alert';

import Wizard from './Wizard';
import ReactCodeInput from 'react-code-input/dist/ReactCodeInput';

const mapStateToProps = state => {
    return {
        appAuthToken: state.auth.appAuthToken,
        errorMessage: state.auth.errorMessage
    };
};

function Alert(props) {
    return <MuiAlert elevation={1} variant="filled" {...props} />;
}

const isRequired = value => (value ? undefined : 'Required');

const isValidEmail = email => (
    (email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) ? undefined : 'Enter a valid email address.'
);

const isValidCode = code => (
    (code && code.length === 6 && /[0-9]/.test(code)) ? undefined : 'Enter the valid 6 digit code.'
);

const composeValidators = (...validators) => (value, allValues) => validators.reduce((error, validator) => error || validator(value, allValues), undefined);

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

const focusOnError = createDecorator();

const Fields = ({
    names,
    subscription,
    fieldsState = {},
    children,
    originalRender
}) => {
    if (!names.length) {
        return (originalRender || children)(fieldsState);
    }
    const [name, ...rest] = names;
    return (
        <Field name={name} subscription={subscription}>
            {fieldState => (
                <Fields
                    names={rest}
                    subscription={subscription}
                    originalRender={originalRender || children}
                    fieldsState={{ ...fieldsState, [name]: fieldState }}
                />
            )}
        </Field>
    );
};

const LoginWizard = (props) => {
   
    /*
    const initialValues = {
        email: undefined,
        password: undefined,
        showPassword: false
    };
    */

    const [showPassword, setShowPassword] = useState(false);
    const [allowPrevious, setAllowPrevious] = useState(false); 
    const [allowNext, setAllowNext] = useState(true);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect( () => {
        setAllowNext(true);
    }, []);

    const codeInputProps = {
        inputStyle: {
            fontFamily: 'monospace',
            margin: '4px',
            MozAppearance: 'textfield',
            width: '15px',
            borderRadius: '3px',
            fontSize: '14px',
            height: '26px',
            paddingLeft: '7px',
            backgroundColor: 'black',
            color: 'lightskyblue',
            border: '1px solid lightskyblue'
        },
        inputStyleInvalid: {
            fontFamily: 'monospace',
            margin: '4px',
            MozAppearance: 'textfield',
            width: '15px',
            borderRadius: '3px',
            fontSize: '14px',
            height: '26px',
            paddingLeft: '7px',
            backgroundColor: 'black',
            color: 'red',
            border: '1px solid red'
        }
    };

    return (
        <MakeAsyncFunction
            listener={promiseListener}
            start={LOGIN_USER}
            resolve={LOGIN_USER_SUCCESS}
            reject={LOGIN_USER_ERROR}
        >
            {onSubmit => (props.appAuthToken && !props.errorMessage) ? (
                <Redirect to="/test" /> // Redirect page after login
            ) : (
                <Wizard
                    onSubmit={onSubmit}
                    decorators={[focusOnError]}
                    // initialValues={initialValues}
                    // validate={validate}
                    subscription={{ submitting: true, pristine: true }}
                    allowPrevious={allowPrevious}
                    allowNext={allowNext}
                >
                    <Wizard.Page>
                        <Box display="flex" alignItems="center" justifyContent="center" pt={3} pb={3}>
                            <Typography variant="h3">Welcome Back!</Typography>
                        </Box>
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
                        <Box display="flex" alignItems="center" justifyContent="center" mt={3} ml={3} mr={3} mb={3}>
                            <Fields names={["email", "password"]}>
                                {fieldsState => (
                                    <Field
                                        name="errorMessage"
                                        subscription={{ submitError: true, dirtySinceLastSubmit: true, values: true }}
                                    >
                                        {({ meta: { submitError, dirtySinceLastSubmit } }) =>
                                            !fieldsState.email.meta.dirtySinceLastSubmit
                                            &&
                                            !fieldsState.password.meta.dirtySinceLastSubmit
                                            &&
                                            submitError && !dirtySinceLastSubmit ?
                                            <Alert severity="error">{submitError}</Alert> : null
                                        }
                                    </Field>
                                )}
                            </Fields>
                        </Box>
                    </Wizard.Page>
                    <Wizard.Page> 
                        <Box display="flex" alignItems="center" justifyContent="center" pt={3} pb={3}>
                            <Typography variant="h3">Verify 2FA</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center" ml={3} mr={3}>
                            <Typography variant="h5">Enter Code</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center" mt={1} ml={3} mr={3} mb={1}>
                            <Field name="code" >
                                {props => (
                                    <ReactCodeInput id="code" name="code" type='number' fields={6} props={codeInputProps}/>
                                )}
                            </Field>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center" mt={3} ml={3} mr={3} mb={3}>
                            <Fields names={["code"]}>
                                {fieldsState => (
                                    <Field
                                        name="errorMessage"
                                        subscription={{ submitError: true, dirtySinceLastSubmit: true, values: true }}
                                    >
                                        {({ meta: { submitError, dirtySinceLastSubmit } }) =>
                                            !fieldsState.code.meta.dirtySinceLastSubmit
                                            &&
                                            submitError && !dirtySinceLastSubmit ?
                                            <Alert severity="error">{submitError}</Alert> : null
                                        }
                                    </Field>
                                )}
                            </Fields>
                        </Box>                            
                    </Wizard.Page>
                </Wizard>
            )} 
        </MakeAsyncFunction>
    );
}

export default connect(mapStateToProps, null)(LoginWizard);