import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import logo from './logo.png'; 
import LoginForm from './LoginForm';
import Copyright from '../../components/Copyright';

const Login = (props) => {

    return (
        <Grid container direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
                <img src={logo} alt="logo" height="40px" width="40px" /><h1><strong>Foliomon</strong></h1>
            </Box>
            <Paper elevation={8}>
                <Box width={400} height={400}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <h2>Welcome Back!</h2>
                    </Box>
                    <LoginForm />
                    <Box m={3}>
                        <Copyright />
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
}

export default Login;