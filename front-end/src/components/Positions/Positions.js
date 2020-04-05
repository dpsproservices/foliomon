import React, { useEffect, useState } from 'react';
import { getAccounts, getAccountPositions } from '../../utils/api';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  Paper  } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '25px',
    height: '100vh'
  },
  table: {
    minWidth: 650
  },
  select: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const Positions = () => {
  const [accounts, setAccounts] = useState();
  const [positions, setPositions] = useState();
  const [active, setActive] = useState('');
  const classes = useStyles();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAccounts();
        console.log(res.data.accounts);
        setAccounts(res.data.accounts);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        if (active && active !== '') {
          const res = await getAccountPositions(active);
          console.log(res.data.securitiesAccount.positions);
          setPositions(res.data.securitiesAccount.positions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [active]);

  const handleChange = (event) => {
    setActive(event.target.value);
  };

  return (
    <Grid container className={classes.root} spacing={2} direction="row" justify="center">
      <Grid item xs={11}>
        <InputLabel id="account-select-label">Account</InputLabel>
        <Select
          className={classes.select}
          labelId="account-select-label"
          id="account-select"
          value={active}
          onChange={handleChange}
        >
          <MenuItem value=""><em>Select</em></MenuItem>
          {accounts && accounts.map(a => <MenuItem value={a.accountId}>{a.accountId}</MenuItem>)}
        </Select>
      </Grid>

      <Grid item xs={11}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Long Quantity</TableCell>
                <TableCell align="right">Short Quantity</TableCell>
                <TableCell align="right">Avg. Price</TableCell>
                <TableCell align="right">Market Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions && positions.map((row) => (
                <TableRow key={row.instrument.symbol}>
                  <TableCell component="th" scope="row">
                    {row.instrument.symbol}
                  </TableCell>
                  <TableCell align="right">{row.longQuantity}</TableCell>
                  <TableCell align="right">{row.shortQuantity}</TableCell>
                  <TableCell align="right">${row.averagePrice.toFixed(2)}</TableCell>
                  <TableCell align="right">${row.marketValue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

    </Grid>
  );
}

export default Positions;
