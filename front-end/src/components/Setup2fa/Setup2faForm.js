import React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from "react-router";
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
//import { GET_QR, GET_QR_SUCCESS, GET_QR_ERROR } from '../../modules/auth/actions';
import { SETUP_2FA, SETUP_2FA_SUCCESS, SETUP_2FA_ERROR } from '../../modules/auth/actions';
import MakeAsyncFunction from 'react-redux-promise-listener';
import { promiseListener } from '../../store';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from 'mui-rff';

//import InputAdornment from '@material-ui/core/InputAdornment';

import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

import Image from 'material-ui-image';
import svgToMiniDataURI from 'mini-svg-data-uri';

import { getQrData } from '../../modules/auth/api';

const useStyles = makeStyles((theme) => ({
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        left: '50%',
    },
}));

const mapStateToProps = state => {
    return {
        appAuthToken: state.auth.appAuthToken,
        //secret: state.auth.secret,
        //qr: state.auth.qr,
        setup2fa: state.auth.setup2fa,
        errorMessage: state.auth.errorMessage
    };
};

function Alert(props) {
    return <MuiAlert elevation={1} variant="filled" {...props} />;
}

const isRequired = value => (value ? undefined : 'Required');

const isValidCode = code => (
    (code && code.length === 6 && /[0-9]/.test(code) ) ? undefined : 'Enter the valid 6 digit code.'
);

const composeValidators = (...validators) => (value, allValues) => validators.reduce((error, validator) => error || validator(value, allValues), undefined);

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

const Setup2faForm = (props) => {

    const classes = useStyles();

    //const { appAuthToken } = props;

    const [appAuthToken, setAppAuthToken] = useState(props.appAuthToken);
    const [qrDataUri, setQrDataUri] = useState("");

    // useEffect( () => {
    //     setAppAuthToken();
    // }, []);

    useEffect( () => {

        const getQrDataUri = async () => {
            try {
                if (appAuthToken) {
                    const response = await getQrData({appAuthToken: appAuthToken});
                    //console.log({ response });
                    const qrSvgString = response.data.qr;
                    //console.log({ qrSvgString });
                    const dataUri = svgToMiniDataURI(qrSvgString);
                    //console.log({ dataUri });
                    setQrDataUri(dataUri);
                }
            } catch (error) {
                console.log({error});
            }
        };

        getQrDataUri();

    }, [appAuthToken]);

    return (
        <MakeAsyncFunction
            listener={promiseListener}
            start={SETUP_2FA}
            resolve={SETUP_2FA_SUCCESS}
            reject={SETUP_2FA_ERROR}
        >
            {onSubmit => (props.appAuthToken && !props.errorMessage && props.setup2fa) ? (
                <Redirect to="/test" /> // Redirect page after setup
            ) : (
                <Form
                    onSubmit={onSubmit}
                    decorators={[focusOnError]}
                    subscription={{ submitting: true, pristine: true }}
                    render={
                        ({  handleSubmit, form, submitting, pristine, values }) => (
                        <form noValidate={true} autoComplete="off" onSubmit={handleSubmit}>
                            <Box display="flex" alignItems="center" justifyContent="center" mt={1} mb={3} >       
                                <Box width={200} height={200}>
                                    <Image id="qr" name="qr" src={qrDataUri} animationDuration={1500} />
                                </Box>
                            </Box>
                            <Box ml={3} mr={3}>
                                <Typography variant="h3">2. Enter the code from the app</Typography>
                            </Box>
                            <Box mt={1} ml={3} mr={3} mb={1}>
                                <Field name="code" validate={composeValidators(isRequired, isValidCode)} >
                                    {props => (
                                        <TextField
                                            id="code"
                                            name="code"
                                            placeholder="Enter code" 
                                            variant="outlined" 
                                            fullWidth
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="center" mt={7} ml={3} mr={3} mb={3}>
                                <Button type="submit" variant="contained" color="primary" fullWidth size="large" height="50px" 
                                        disabled={submitting}
                                        className={clsx({ [classes.buttonSuccess]: !submitting })}
                                >
                                    Continue
                                </Button>
                                {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
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
                            {/*<Box>
                                <Fields names={["code"]}>
                                    {fieldsState => (
                                        <pre>{JSON.stringify(fieldsState, undefined, 2)}</pre>
                                    )}
                                </Fields>
                            </Box>*/}
                        </form>
                    )}
                />
            )} 
        </MakeAsyncFunction>
    );
}

export default connect(mapStateToProps, null)(Setup2faForm);