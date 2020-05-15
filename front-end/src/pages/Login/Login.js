import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import logo from './logo.png'; 
import LoginForm from './LoginForm';
import Copyright from '../../components/Copyright';

const Login = (props) => {
    return (
        <Grid container direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <Box display="flex" alignItems="center" justifyContent="center" width={400} height={50} pb={4} >
                <Box height="50px" width="100px">
                    <img src={logo} alt="logo" height="50px" width="50px" />
                </Box>
                <Box height="50px" width="150px">
                    <Typography variant="h1">Foliomon</Typography>
                </Box>
                <Box height="50px" width="100px">
                    
                </Box>
            </Box>
            <Paper elevation={8}>
                <Box width={400} height={400}>
                    <Box display="flex" alignItems="center" justifyContent="center" pt={3} pb={3}>
                        <Typography variant="h3">Welcome Back!</Typography>
                    </Box>
                    <LoginForm />
                </Box>
                <Box m={3}>
                    <Copyright />
                </Box>
            </Paper>
        </Grid>
    );
}

export default Login;