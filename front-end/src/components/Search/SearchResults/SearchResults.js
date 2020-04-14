import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { getInstruments } from '../../../utils/api';
import {
  Grid,
  Paper,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList } from 'react-window';

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
  },
  listItem: {
    cursor: 'pointer',
    fontWeight: 400,
    '&:hover': {
      backgroundColor: 'rgb(7, 177, 77, 0.42)'
    }
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

  const rows = results && Object.keys(results).map(r => (
    {
      symbol: results[r].symbol,
      description: results[r].description
    }
  ));

  const Row = ({ index, style }) => (
    <div style={style} className={classes.listItem} onClick={handleClick(rows[index].symbol)}>
        <span style={{ fontSize: '1.3em' }}>{rows[index].symbol}</span>
        <span style={{ fontSize: '0.75em' }}>    {rows[index].description}</span>
    </div>
  );

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
                    <FixedSizeList
                      height={300}
                      itemCount={Object.keys(results).length}
                      itemSize={50}
                      width={300}
                    >
                      {Row}
                    </FixedSizeList>
                }
              </Paper>
            </Grid>
          </Grid>
        }
    </Grid>
  );
}

export default SearchResults;