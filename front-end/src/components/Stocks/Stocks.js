import React, { Fragment, useCallback, useState, useEffect } from 'react';
import {
  colors,
  Grid,
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
import Headlines from '../Headlines';
import Websocket from '../Websocket';
import Watchlists from '../Watchlists';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '25px',
    paddingLeft: '10px',
    height: '100vh',
    width: '100vw'
  },
  upTick: {
    color: colors.green[400]
  },
  downTick: {
    color: colors.red[500]
  }
}));

const Stocks = ({ match } ) => {
  const [isLoading, setIsLoading] = useState();
  const [result, setResult] = useState();
  const [selectedSymbol, setSelectedSymbol] = useState(match && match.params && match.params.symbol);
  const [prices, setPrices] = useState({});
  const [headlines, setHeadlines] = useState([]);
  const classes = useStyles();

  const subscriptions = [];
  const messageHandlers = [];
  
  if (selectedSymbol) {

    subscriptions.push({
      "service": "QUOTE",
      "command": "SUBS",
      "parameters": {
        "keys": selectedSymbol.toString(),
        "fields": "0,1,2,3,4,5,15,28,29"
      }
    }
    // {
    //   "service": "NEWS_HEADLINE",
    //   "command": "SUBS",
    //   "parameters": {
    //     "keys": selectedSymbol.toString(),
    //     "fields": "0,2,3,5,10"
    //   }
    // },
    // {
    //   "service": "NEWS_HEADLINE_LIST",
    //   "command": "GET",
    //   "parameters": {
    //     "keys": selectedSymbol.toString(),
    //     "fields": "0"
    //   }
    //}
    );

    messageHandlers.push((message) => {
      if (message.data && message.data.length === 1
        && message.data[0].service === 'QUOTE') {
          const { content } = message.data[0];
          content && content.forEach(row => {
            const symbol = row.key;
            let bidPrice = row['1'];
            let askPrice = row['2'];
            let lastPrice = row['3'];
            let bidSize = row['4'];
            let askSize = row['5'];
            let closePrice = row['15'];
            let openPrice = row['28'];
            let netChange = row['29'];

            setPrices(prevPrices => {
              const prevPrice = prevPrices[symbol];
              const prevBidPrice = (prevPrice && prevPrice.bidPrice) || 0;
              const prevAskPrice = (prevPrice && prevPrice.askPrice) || 0;
              const prevLastPrice = (prevPrice && prevPrice.lastPrice) || 0;
              const prevBidSize = (prevPrice && prevPrice.bidSize) || 0;
              const prevAskSize = (prevPrice && prevPrice.askSize) || 0;
              const prevClosePrice = (prevPrice && prevPrice.closePrice) || 0;
              const prevOpenPrice = (prevPrice && prevPrice.openPrice) || 0;
              const prevNetChange = (prevPrice && prevPrice.netChange) || 0;

              bidPrice = bidPrice || prevBidPrice || 0;
              askPrice = askPrice || prevAskPrice || 0;
              lastPrice = lastPrice || prevLastPrice || 0;
              bidSize = bidSize || prevBidSize || 0;
              askSize = askSize || prevAskSize || 0;
              closePrice = closePrice || prevClosePrice || 0;
              openPrice = openPrice || prevOpenPrice || 0;
              netChange = netChange || prevNetChange || 0;

              const bidDirection = bidPrice === prevBidPrice || prevBidPrice === 0 ? 'none' : bidPrice > prevBidPrice ? 'up' : 'down';
              const askDirection = askPrice === prevAskPrice || prevAskPrice === 0 ? 'none' : askPrice > prevAskPrice ? 'up' : 'down';
              const lastDirection = lastPrice === prevLastPrice || prevLastPrice === 0 ? 'none' : lastPrice > prevLastPrice ? 'up' : 'down';
              
              return ({
                ...prevPrices,
                [symbol]: {
                  bidPrice,
                  askPrice,
                  lastPrice,
                  bidDirection,
                  askDirection,
                  lastDirection,
                  bidSize,
                  askSize,
                  closePrice,
                  openPrice,
                  netChange
                }
              });
            });
          });
        }
    });

    messageHandlers.push((message) => {
      if (message.data && message.data.length === 1
        && message.data[0].service === 'NEWS_HEADLINE_LIST') {
          const { content } = message.data[0];
          const newHeadlines = content && content.map(row => ({
            dateTime: row['2'],
            headlineId: row['3'],
            headline: row['5'],
            storySource: row['10']
          }));
          setHeadlines(prevHeadlines => {
            return([...prevHeadlines, newHeadlines]);
          });
      }
    });
  }

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
  const divDate = data && data.fundamental && data.fundamental.dividendDate
    && data.fundamental.dividendDate.trim() !== '' && new Date(data.fundamental.dividendDate);
  const divMonth = divDate && divDate.getMonth()+1;
  const divDay = divDate && divDate.getDate();
  const divDateString = divMonth && divDay ? `${divMonth} / ${divDay}` : 'NA';

  const symbolPrices = prices[selectedSymbol];
  const {
    bidPrice,
    askPrice,
    lastPrice,
    bidDirection,
    askDirection,
    lastDirection,
    bidSize,
    askSize,
    netChange,
    openPrice,
    closePrice
  } = symbolPrices || {};

  const percentChange = ((netChange / closePrice) * 100).toFixed(2);
  const changeDirection = netChange >= 0 ? 'up' : 'down';

  const getPriceClass = (direction) => {
    if (direction === 'up') {
      return classes.upTick;
    }
    if (direction === 'down') {
      return classes.downTick;
    }
    
    return '';
  };
  
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
            <Websocket subscriptions={subscriptions} messageHandlers={messageHandlers} />
            <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
              <Grid item xs={6}>
                <Chart symbol={selectedSymbol} />
              </Grid>
              <Grid item xs={6}>
                <Headlines headlines={headlines}/>
              </Grid>
            </Grid>
            <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
              <Grid item xs={4}>
                <List className={classes.list}>
                  <ListItem>
                    <ListItemText primary="Last"/>
                    <ListItemSecondaryAction>
                      <span className={getPriceClass(lastDirection)}><b>{lastPrice}</b></span>
                      <span className={getPriceClass(changeDirection)}><b> ({netChange} / {percentChange}%)</b></span>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText primary="Bid"/>
                    <ListItemSecondaryAction className={getPriceClass(bidDirection)}>
                      {bidPrice} x{bidSize}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText primary="Ask"/>
                    <ListItemSecondaryAction className={getPriceClass(askDirection)}>
                      {askPrice} x{askSize}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText primary="Open"/>
                    <ListItemSecondaryAction>
                      {openPrice}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText primary="Prev. Close"/>
                    <ListItemSecondaryAction>
                      {closePrice}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText primary="52 Week Range"/>
                    <ListItemSecondaryAction>
                      {data.fundamental.low52} - {data.fundamental.high52}
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
                    <ListItemText primary="Dividend Amount/Yield"/>
                    <ListItemSecondaryAction>
                      {data.fundamental.dividendAmount} / {data.fundamental.dividendYield}%
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText primary="Ex-Dividend Date"/>
                    <ListItemSecondaryAction>
                      {divDateString}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
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
      <Grid container spacing={4} direction="row" justify="flex-start" alignItems="flex-start">
        <Grid item xs={4}>
          <Movers />
        </Grid>
        <Grid item xs={4}>
          <Watchlists />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Stocks;
