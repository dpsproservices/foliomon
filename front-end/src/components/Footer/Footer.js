import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="body1">
        &copy;{' '}
        <Link
          component="a"
          href="https://localhost/"
          target="_blank"
        >
        </Link>
      </Typography>
      <Typography variant="caption"></Typography>
    </div>
  );
};

export default Footer;