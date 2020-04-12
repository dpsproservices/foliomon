import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { getInstruments } from '../../../utils/api';
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  results: {
    zIndex: 100,
    height: 0,
    overflow: 'visible',
    paddingLeft: '10px'
  },
  paper: {
    height: '300px',
    overflow: 'scroll'
  },
  spinner: {
    padding: '50px',
    margin: 'auto atuo'
  }
}));

const SearchResults = ({ onSelect, searchString, clearSearch }) => {
  const [isLoading, setIsLoading] = useState();
  const [results, setResults] = useState();
  const classes = useStyles();

  const handleClick = (symbol) => (event) => {
    setResults(null);
    onSelect(symbol);
    clearSearch();
  };

  useEffect(() => {

    if (searchString) {
      setIsLoading(true);
      const req = { symbol: `${searchString}.*`, projection: 'symbol-regex' };

      getInstruments(req)
      .then((res) => {        
        console.log(res.data);
        setResults(res.data);
      })
      .catch((error) => {
        console.log(error);
        setResults(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setResults(null);
    }
  }, [searchString]);

  return (
    <Grid container className={classes.results}>
        {(results || isLoading) &&
          <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item xs={8}>
              <Paper variant="outlined" square elevation={4} className={classes.paper}>
                {isLoading
                  ?
                    <CircularProgress size={38} className={classes.spinner} />
                  :
                    <List aria-label="search-results" dense>
                      {results && Object.keys(results).map(r => (
                        <ListItem button key={r} onClick={handleClick(results[r].symbol)}>
                          <ListItemText primary={results[r].symbol} secondary={results[r].description} />
                        </ListItem>
                      ))}
                    </List>
                }
              </Paper>
            </Grid>
          </Grid>
        }
    </Grid>
  );
}

export default SearchResults;