import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Setup2faForm from './Setup2faForm';

const Setup2fa = (props) => {
    return (
        <Grid container direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <Box display="flex" alignItems="center" justifyContent="center" width={500} height={50} pb={4} >
                <Typography variant="h1">Setup 2FA</Typography>
            </Box>
            <Paper elevation={8}>
                <Box width={400} height={600}>
                    <Box display="flex" alignItems="center" justifyContent="center" pt={3} pb={3}>
                        <Typography variant="h3">1. Scan QR code</Typography>
                    </Box>
                    <Setup2faForm />
                </Box>
            </Paper>
        </Grid>
    );
}

export default Setup2fa;