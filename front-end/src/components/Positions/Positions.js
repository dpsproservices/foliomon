import React, { useEffect, useState } from 'react';
import { getAccountPositions } from '../../utils/api';
import { Link } from 'react-router-dom';
import Websocket from '../Websocket';
import { makeStyles } from '@material-ui/core/styles';
import {
  colors,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    activeAccount: state.accountId
  };
};

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '25px',
    //height: '100vh'
    width: 'calc(100vw - 240px)',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100vw - 100px)'
    }
  },
  table: {
    minWidth: 650
  },
  tableHeader: {
    fontSize: '0.80rem !important'
  },
  tableContainer: {
    //margin: '15px'
  },
  tableRow: {
    '&:nth-child(even)': { background: '#f5f5f5' }
  },
  upTick: {
    color: colors.green[400]
  },
  downTick: {
    color: colors.red[500]
  }
}));

const Positions = ({ activeAccount }) => {
  const [positions, setPositions] = useState();
  const [prices, setPrices] = useState({});
  const classes = useStyles();

  const subscriptions = [];
  
  if (positions) {
    const symbols = positions && positions.map(p => p.instrument.symbol).toString();
    subscriptions.push({
      "service": "QUOTE",
      "command": "SUBS",
      "parameters": {
          "keys": symbols,
          "fields": "0,1,2,3"
      }
    });
  }
  
  const messageHandlers = [];

  if (positions) {
    messageHandlers.push((message) => {
      if (message.data && message.data.length === 1
        && message.data[0].service === 'QUOTE') {
          const { content } = message.data[0];
          content && content.forEach(row => {
            let bidPrice = row['1'];
            let askPrice = row['2'];
            let lastPrice = row['3'];
            const symbol = row.key;

            setPrices(prevPrices => {
              const prevPrice = prevPrices[symbol];
              const prevBidPrice = (prevPrice && prevPrice.bidPrice) || 0;
              const prevAskPrice = (prevPrice && prevPrice.askPrice) || 0;
              const prevLastPrice = (prevPrice && prevPrice.lastPrice) || 0;
              bidPrice = bidPrice || prevBidPrice || 0;
              askPrice = askPrice || prevAskPrice || 0;
              lastPrice = lastPrice || prevLastPrice || 0;
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
                  lastDirection
                }
              });
            });
          });
        }
    });
  }

  useEffect(() => {
    const getAccountPositionsData = async () => {
      try {
        if (activeAccount && activeAccount !== '') {
          const res = await getAccountPositions(activeAccount);
          console.log(res.data.securitiesAccount.positions);
          const nonCashPositions = res.data.securitiesAccount.positions.filter(p => p.instrument.symbol !== 'MMDA1');
          setPositions(nonCashPositions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAccountPositionsData();
  }, [activeAccount]);

  const getPriceClass = (direction) => {
    if (direction === 'up') {
      return classes.upTick;
    }
    if (direction === 'down') {
      return classes.downTick;
    }
    
    return '';
  };

  const totalMarketValue = positions && positions.reduce((acc, curr) => acc + curr.marketValue, 0);
  const seriesData = positions && positions.map(p => ({ name: p.instrument.symbol, y: ((p.marketValue/totalMarketValue) * 100) }));

  const chartOptions = {
    chart: {
      //spacing: [0, 0, 0, 0],
      //margin: [50, 80, 50, 80],
      //height: 400,
      //width: 460,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: ''
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        //size: '78%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          connectorColor: 'silver'
        }
      }
    },
    series: [{
      name: 'Percentage',
      data: seriesData
    }]
  };

  return (
    <Grid container className={classes.root}>
      <Websocket subscriptions={subscriptions} messageHandlers={messageHandlers} />
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="center">
        <Grid item xs={10}>
          <TableContainer component={Paper} elevation={4} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell classes={{ root: classes.tableHeader }}>Symbol</TableCell>
                  <TableCell classes={{ root: classes.tableHeader }} align="right">Long Quantity</TableCell>
                  <TableCell classes={{ root: classes.tableHeader }} align="right">Short Quantity</TableCell>
                  <TableCell classes={{ root: classes.tableHeader }} align="right">Avg. Price $</TableCell>
                  <TableCell classes={{ root: classes.tableHeader }} align="right">Bid Price $</TableCell>
                  <TableCell classes={{ root: classes.tableHeader }} align="right">Ask Price $</TableCell>
                  <TableCell classes={{ root: classes.tableHeader }} align="right">Last Price $</TableCell>
                  <TableCell classes={{ root: classes.tableHeader }} align="right">Market Value $</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions && positions.map((row) => {
                  const { symbol } = row.instrument;
                  const symbolPrices = prices[symbol];
                  const {
                    bidPrice,
                    askPrice,
                    lastPrice,
                    bidDirection,
                    askDirection,
                    lastDirection
                  } = symbolPrices || {};
                  return (
                    <TableRow key={symbol} className={classes.tableRow}>
                      <TableCell component="th" scope="row">
                        <Link to={`/stocks/${symbol}`}>
                          {symbol}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{row.longQuantity}</TableCell>
                      <TableCell align="right">{row.shortQuantity}</TableCell>
                      <TableCell align="right">{row.averagePrice.toFixed(2)}</TableCell>
                      <TableCell align="right" className={getPriceClass(bidDirection)}>{bidPrice && bidPrice.toFixed(2)}</TableCell>
                      <TableCell align="right" className={getPriceClass(askDirection)}>{askPrice && askPrice.toFixed(2)}</TableCell>
                      <TableCell align="right" className={getPriceClass(lastDirection)}>{lastPrice && lastPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">{row.marketValue.toFixed(2)}</TableCell>
                    </TableRow>);
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default connect(mapStateToProps, null)(Positions);
