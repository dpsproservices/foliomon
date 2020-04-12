import _ from 'lodash'
import React, { useState } from 'react'
import {
  Grid,
  Input,
  InputLabel,
  InputAdornment
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SearchResults from './SearchResults';

const Search = ({ onSelect }) => {
  const [searchString, setSearchString] = useState('');

  const handleChange = (event) => {
    const newValue = event.target.value.trim();
    setSearchString(newValue);
  };

  const handleClear = () => {
    setSearchString('');
  };

  return (
    <Grid container>
      <Grid container spacing={2} direction="row" justify="flex-start">
        <Grid item xs={8}>
          <InputLabel htmlFor="search-input">Search</InputLabel>
          <Input
            fullWidth
            id="search-input"
            autoComplete="off"
            value={searchString}
            onChange={_.debounce(handleChange, 500, { leading: true })}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Grid>

        <SearchResults onSelect={onSelect} searchString={searchString} clearSearch={handleClear} />
      </Grid>
    </Grid>
  );
}

export default Search;