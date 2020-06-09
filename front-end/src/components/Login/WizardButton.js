import React from 'react';
//import { useEffect } from 'react';
//import { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

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

const WizardButton = (props) => {

    const classes = useStyles();

    const { page, isLastPage, submitting, setPreviousPage, canGoPrevious, canGoNext } = props;

    return (
        <Box display="flex" alignItems="center" justifyContent="center" mt={7} ml={3} mr={3} mb={3}>
            { page > 0 && canGoPrevious && (
                <Button type="button" variant="contained" color="primary" fullWidth size="large" height="50px"
                    disabled={submitting}
                    className={clsx({ [classes.buttonSuccess]: !submitting })}
                    onClick={setPreviousPage}>
                >
                    Previous
                </Button>
            )}
            { !isLastPage && canGoNext && (
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" height="50px"
                    disabled={submitting}
                    className={clsx({ [classes.buttonSuccess]: !submitting })}
                >
                    Next
                </Button>
            )}
            { isLastPage && (
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" height="50px"
                    disabled={submitting}
                    className={clsx({ [classes.buttonSuccess]: !submitting })}
                >
                    Submit
                </Button>
            )}
            {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
        </Box>
    )
};
export default WizardButton;