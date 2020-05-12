import React, { useState } from 'react';
//import React, { Component } from 'react';
//import { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { Field } from 'redux-form';
import * as actions from '../../modules/auth/actions';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
//import TextField from '@material-ui/core/TextField';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
//import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Typography from '@material-ui/core/Typography';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Button from '@material-ui/core/Button';

const classes = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },

    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
}));

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://foliomon.com/">
                Foliomon
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const mapStateToProps = (state) => {
    //console.log({ state });

    return {
        errorMessage: state.auth.status.errorMessage
    };
}

const validate = values => {
    const errors = {};

    const requiredFields = ['email', 'password'];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }

    return errors;
}

const renderTextField = (
    { input, label, meta: { touched, error }, ...custom },
) => (
    <TextField
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...custom}
    />
);

const renderEmail = (
    { input, label, meta: { touched, error }, ...custom }
) => {
    <FormControl
        className={clsx(classes.margin, classes.textField)}
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

const Login = (props) => {
//class Login extends Component {

    const [formProps, setFormProps] = useState({
        email: '',
        password: '',
        showPassword: false,
    });

    /*
    useEffect(() => {
        //console.log({formProps});
    }, [formProps]);
    */
    //const [errorMessage, setErrorMessage] = useState('');

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

    const onSubmit = () => {

        console.log({formProps});
        console.log({props});


        /*
        props.signin(formProps, () => {
            props.history.push('/overview'); // redirect to the Overview page
        });
        */

    };


/*
    const renderPassword = (
        { input, label, meta: { touched, error }, ...custom }
    ) => {
        <FormControl
            className={clsx(classes.margin, classes.textField)}
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
    const { handleSubmit, pristine, submitting } = props;

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Card>
            <div className={classes.paper}>

                <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    
                    <div>
                        <Field name="email" component={renderEmail} label="Email" />
                    </div>
                    <div>
                        <Field name="password" component={renderTextField} label="Password" />
                    </div>
                    {/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />  */}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={pristine || submitting}
                    >
                        Sign In
                    </Button>
                    {/* <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid> */}
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
            </Card>
        </Container>
    );

}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signin' , validate })
)(Login);