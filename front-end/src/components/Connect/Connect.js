import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh'
  }
}));

const Connect = () => {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="center" alignItems="center" className={classes.root}>
      <Button variant="contained" color="primary" href={process.env.REACT_APP_AUTH_URL}>Connect</Button>
    </Grid>
  );
}

export default Connect;
