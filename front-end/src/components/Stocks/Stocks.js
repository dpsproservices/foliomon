import React, { Fragment, useCallback, useState } from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getInstruments } from '../../utils/api';
import Search from '../Search';
import Chart from '../Chart';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '25px',
    paddingLeft: '10px',
    height: '100vh',
    width: '100vw'
  }
}));

const Stocks = () => {
  const [isLoading, setIsLoading] = useState();
  const [result, setResult] = useState();
  const [selectedSymbol, setSelectedSymbol] = useState();
  const classes = useStyles();

  const getStockFundamentals = useCallback(async (symbol) => {
    try {
      setIsLoading(true);
      const req = { symbol, projection: 'fundamental' };
      const res = await getInstruments(req);
      console.log(res.data);
      setResult(res.data);
      setSelectedSymbol(symbol);
    } catch (error) {
      console.log(error);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const data = result && result[selectedSymbol];
  const divDate = data && new Date(data.fundamental.dividendDate);
  
  return (
    <Grid container className={classes.root}>
      <Grid container spacing={2} direction="row" justify="flex-start">
        <Grid item xs={4}>
          <Search onSelect={getStockFundamentals} />
        </Grid>
      </Grid>
      {data &&
        <Fragment>
          <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
            <Grid item xs={4}>
              <Chart symbol={selectedSymbol} />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h1">{selectedSymbol}    [{data.exchange}]</Typography>
              <Typography variant="body1">{data.description}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
            <Grid item xs={4}>
              <List className={classes.list}>
                <ListItem>
                  <ListItemText primary="52 Week Range"/>
                  <ListItemSecondaryAction>
                    {data.fundamental.low52} - {data.fundamental.high52}
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Dividend Amount/Yield"/>
                  <ListItemSecondaryAction>
                    {data.fundamental.dividendAmount} / {data.fundamental.dividendYield}%
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Ex-Dividend Date"/>
                  <ListItemSecondaryAction>
                    {divDate.getMonth()+1}/{divDate.getDate()}
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Avg. Volume"/>
                  <ListItemSecondaryAction>
                    {data.fundamental.vol10DayAvg}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                <ListItem>
                  <ListItemText primary="P/E Ratio"/>
                  <ListItemSecondaryAction>
                    {data.fundamental.peRatio}x
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="EPS"/>
                  <ListItemSecondaryAction>
                    {data.fundamental.epsTTM}
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Market Cap"/>
                  <ListItemSecondaryAction>
                    {data.fundamental.marketCap}
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Shares Outstanding"/>
                  <ListItemSecondaryAction>
                    {data.fundamental.sharesOutstanding}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Fragment>
      }
    </Grid>
  );
}

export default Stocks;
