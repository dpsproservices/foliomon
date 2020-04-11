import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { getInstruments } from '../../utils/api';
import {
  Grid,
  Input,
  InputLabel,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  results: {
    zIndex: 100
  }
}));

const Search = ({ onSelect }) => {
  const [isLoading, setIsLoading] = useState();
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState();
  const classes = useStyles();

  const handleChange = (event) => {
    setSearchString(event.target.value.trim());
  };

  const handleClick = (symbol) => (event) => {
    setResults(null);
    onSelect(symbol);
  };

  useEffect(() => {
    const getStocks = async () => {
      try {
        setIsLoading(true);
        const req = { symbol: `${searchString}*`, projection: 'symbol-regex' };
        const res = await getInstruments(req);
        console.log(res.data);
        setResults(res.data);
      } catch (error) {
        console.log(error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchString) {
      getStocks();
    } else {
      setResults(null);
    }
  }, [searchString]);

  return (
    <Grid container>
      <Grid container spacing={2} direction="row" justify="flex-start">
        <Grid item xs={12}>
          <InputLabel htmlFor="search-input">Search</InputLabel>
          <Input
            id="search-input"
            autoComplete="off"
            value={searchString}
            onChange={_.debounce(handleChange, 1000, { leading: true })}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Grid>
        {isLoading && 
          <Grid container spacing={2} direction="row" justify="center" className={classes.results}>
            <Grid item xs={4}>
              <CircularProgress size={28} />
            </Grid>
          </Grid>
        }
        {results &&
          <Grid container spacing={2} direction="row" justify="flex-start" className={classes.results}>
            <Grid item xs={12}>
              <Paper variant="outlined" square elevation={4}>
                <List aria-label="search-results" dense>
                  {Object.keys(results).map(r => (
                    <ListItem button key={r} onClick={handleClick(results[r].symbol)}>
                      <ListItemText primary={results[r].symbol} secondary={results[r].description} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        }
      </Grid>
    </Grid>
  );
}

export default Search;