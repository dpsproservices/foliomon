import React from 'react';
//import { useState } from 'react';
//import { useEffect } from 'react';

//import { compose } from 'redux';
//import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form'

//import * as actions from '../../modules/auth/actions';

//import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

/*
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
*/

/*
const mapStateToProps = (state) => {
    console.log({ state });

    return {
        errorMessage: state.auth.status.errorMessage
    };
}
*/

const isRequired = value => (value ? undefined : 'Required');

const isValidEmail = email => (
   ( email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ) ? undefined : 'Invalid email address'
);

const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

const renderTextField = (
    { input, label, meta: { touched, error }, ...custom },
) => (
    <TextField
        variant="outlined"
        fullWidth
        //errorText={touched && error}
        {...input}
        {...custom}
    />
);

/*
    const renderEmail = (
        { input, label, meta: { touched, error }, ...custom }
    ) => {
        <FormControl
            variant="outlined"
            required
            fullWidth
        >
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
                id="email"
                name="email"
                type="text"
                value={formProps.email}
                onChange={handleChange('email')}
                labelWidth={70}
                autoComplete="none"
            />
            <FormHelperText id="email-error-text">Email Error</FormHelperText>
        </FormControl>
    };
*/

/*
    const renderPassword = (
        { input, label, meta: { touched, error }, ...custom }
    ) => {
        <FormControl
            variant="outlined"
            required
            fullWidth
        >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
                id="password"
                name="password"
                type={formProps.showPassword ? 'text' : 'password'}
                value={formProps.password}
                onChange={handleChange('password')}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Show password"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {formProps.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
                labelWidth={70}
                autoComplete="none"
            />
            <FormHelperText id="password-error-text">Password Error</FormHelperText>
        </FormControl>
    };
*/

const LoginForm = (props) => {
/*
    const [formProps, setFormProps] = useState({
        email: '',
        password: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setFormProps({ ...formProps, [prop]: event.target.value });
        //console.log({ formProps });
    };

    const handleClickShowPassword = () => {
        setFormProps({ ...formProps, showPassword: !formProps.showPassword });
        //console.log({ formProps });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
*/
    const onSubmit = async (values) => {

        //console.log({formProps});
        //console.log({props});

        console.log({ values });

        /*
        props.signin(formProps, () => {
            props.history.push('/overview'); // redirect to the Overview page
        });
        */

    };

    //const { initialValues } = props;

    return (
        <Form
            onSubmit={onSubmit}
            // initialValues={initialValues}
            // validate={validate}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Box m={3}>
                        <label><strong>Email</strong></label>
                    </Box>
                    <Box m={3}>
                        <Field name="email" placeholder="Email Address" validate={composeValidators(isRequired, isValidEmail)} component={renderTextField} />
                    </Box>
                    <Box m={3}>
                        <label><strong>Password</strong></label>
                    </Box>                            
                    <Box m={3}>
                        <Field name="password" placeholder="Password" validate={isRequired} component={renderTextField} />
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="center" m={3}>
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting}>
                            Sign In
                        </Button>
                    </Box>
                    <pre>{JSON.stringify({ values }, 0, 2)}</pre>
                </form>
            )}
        />
    );
}

export default LoginForm;

//export default connect(mapStateToProps, actions)(Login);

// export default compose(
//     connect(mapStateToProps, actions),
//     reduxForm({ form: 'signin' , validate })
// )(Login);