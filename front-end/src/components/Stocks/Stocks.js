import React, { Fragment, useCallback, useState, useEffect } from 'react';
import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Divider,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getInstruments } from '../../utils/api';
import Search from '../Search';
import Chart from '../Chart';
import Movers from '../Movers';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '25px',
    paddingLeft: '10px',
    height: '100vh',
    width: '100vw'
  }
}));

const Stocks = ({ match } ) => {
  const [isLoading, setIsLoading] = useState();
  const [result, setResult] = useState();
  const [selectedSymbol, setSelectedSymbol] = useState(match && match.params && match.params.symbol);
  const classes = useStyles();

  useEffect(() => {
    const getData = async () => {
      try {
        if (selectedSymbol) {
          setIsLoading(true);
          const req = { symbol: selectedSymbol, projection: 'fundamental' };
          const res = await getInstruments(req);
          console.log(res.data);
          setResult(res.data);
        }
      } catch (error) {
        console.log(error);
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [selectedSymbol]);

  const handleSelect = useCallback(async (symbol) => {
    try {
      setSelectedSymbol(symbol);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const data = result && result[selectedSymbol];
  const divDate = data && new Date(data.fundamental.dividendDate);
  
  return (
    <Grid container className={classes.root}>
      <Grid container spacing={2} direction="row" justify="flex-start">
        <Grid item xs={4}>
          <Search onSelect={handleSelect} />
        </Grid>
        {data &&
          <Grid item xs={4}>
            <Typography variant="h2">{selectedSymbol}    [{data.exchange}]</Typography>
            <Typography variant="body1">{data.description}</Typography>
          </Grid>
        }
      </Grid>
      {isLoading
        ?
          <CircularProgress size={38} />
        :
          data &&
          <Fragment>
            <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
              <Grid item xs={6}>
                <Chart symbol={selectedSymbol} />
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
      <Grid container spacing={4} direction="row" justify="flex-start">
        <Grid item xs={4}>
          <Movers />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Stocks;
