import React, { useEffect, useState } from 'react';
import { getAccount, getAccountTransactions, getPriceHistory } from '../../utils/api';
import { convertCase, numberWithCommas } from '../../utils/utils';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const mapStateToProps = state => {
  return {
    activeAccount: state.accountId
  };
};

const useStyles = makeStyles({
  root: {
    padding: '25px'
  },
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  icon: {
    float: 'right',
    color: 'green'
  },
  table: {
    minWidth: 450
  },
  tableContainer: {
    //margin: '25px'
  },
  tableRow: {
    '&:nth-child(even)': { background: '#f5f5f5' }
  },
  changeUp: {
    color: 'green'
  },
  changeDown: {
    color: 'red'
  },
  list: {
    padding: 0
  },
  item: {
    //maxHeight: 200,
    //minWidth: 340
  }
});

const Overview = ({ activeAccount }) => {
   const [account, setAccount] = useState();
   const [transactions, setTransactions] = useState();
   const [spData, setSPData] = useState();
   const [djData, setDJData] = useState();
   const [ncData, setNCData] = useState();
   const classes = useStyles();

  useEffect(() => {
    const getAccountsData = async () => {
      try {
        if (activeAccount && activeAccount !== '') {
          const accountRes = await getAccount(activeAccount);
          //console.log(accountRes.data);
          const transactionsRes = await getAccountTransactions(activeAccount, 1);
          //console.log(transactionsRes.data);
          
          const accountData = accountRes.data && accountRes.data.securitiesAccount;
          setAccount(accountData);
          setTransactions(transactionsRes.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAccountsData();
  }, [activeAccount]);

  useEffect(() => {
    const getStockData = async () => {
      try {
        const endDate = new Date().getTime();
        const date = new Date();
        date.setHours(8,0,0,0);
        const startDate = date.getTime();

        let req = {
          symbol: '$SPX.X',
          period: undefined,
          periodType: undefined,
          frequency: '30',
          frequencyType: 'minute',
          startDate,
          endDate
        };

        // S&P 500
        const resSP = await getPriceHistory(req);
        //console.log(resSP.data);
        const spLine = resSP.data && resSP.data.candles.map(o => [o.datetime, o.close]);
        setSPData(spLine);

        // Dow Jones Industrials
        req.symbol = '$DJI';
        const resDJ = await getPriceHistory(req);
        //console.log(resDJ.data);
        const djLine = resDJ.data && resDJ.data.candles.map(o => [o.datetime, o.close]);
        setDJData(djLine);

        // Nasdaq Composite
        req.symbol = '$COMPX';
        const resNC = await getPriceHistory(req);
        //console.log(resNC.data);
        const ncLine = resNC.data && resNC.data.candles.map(o => [o.datetime, o.close]);
        setNCData(ncLine);
      } catch (error) {
        console.log(error);
      }
    };

    getStockData();
  }, []);

  const accountType = account && account.type && convertCase(account.type);

  const getTradeDescription = (transaction) => {
    const { transactionItem } = transaction;
    const { instruction, price, amount } = transactionItem;
    const { symbol } = transactionItem.instrument;

    return `${convertCase(instruction)} ${amount} ${symbol} @ ${price}`;
  };

  const getDivDescription = (transaction) => {
    const { description, transactionItem } = transaction;
    const { symbol } = transactionItem.instrument;

    return `${convertCase(description)} (${symbol})`;
  };

  const getDescription = (transaction) => {
    const { type } = transaction;
    switch(type.toUpperCase()) {
      case "TRADE":
        return getTradeDescription(transaction);
      case "DIVIDEND_OR_INTEREST":
        return getDivDescription(transaction);
      case "ELECTRONIC_FUND":
        return "Electronic funding"
      default:
        return type;
    }
  };

  const totalValue = account && account.currentBalances.liquidationValue;
  const initialValue = account && account.initialBalances.liquidationValue;

  let valueChange = 0;
  let percentChange = 0;
  if (account) {
    valueChange = totalValue - initialValue;
    percentChange = ((valueChange / initialValue) * 100);
  }

  const basicChartOptions = {
    time: {
      timezoneOffset: new Date().getTimezoneOffset()
    },
    chart: {
      zoomType: 'x',
      backgroundColor: null,
      borderWidth: 0,
      spacingTop: 20,
      spacingBottom: 20,
      width: 350,
      height: 200,
      style: {
        overflow: 'visible'
      },
      skipClone: true
    },
    credits: {
      enabled: false
    },
    xAxis: {
      crosshair: true,
      type: 'datetime',
      labels: {
        enabled: true
      },
      startOnTick: false,
      endOnTick: false,
    },
    yAxis: {
      endOnTick: false,
      startOnTick: false,
      labels: {
        enabled: true,
        formatter: function() {
          return Highcharts.numberFormat(this.value, 0, '', ',');
        }
      },
      title: {
        text: null
      },
    },
    legend: {
      enabled: false
    },
    tooltip: {
      borderWidth: 0,
      backgroundColor: 'none',
      pointFormatter: function() {
        return Highcharts.numberFormat(this.y, 0, '', ',');
      },
      shadow: false,
      style: {
          fontSize: '18px'
      }
    },
    plotOptions: {
      area: {
        connectNulls: false,
        threshold: null,
        animation: false,
        lineWidth: 1,
        shadow: false,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        marker: {
          radius: 2,
          states: {
            hover: {
              radius: 2
            }
          }
        },
        fillOpacity: 0.25
      },
      column: {
        negativeColor: '#910000',
        borderColor: 'silver'
      }
    }
  };

  const ncChartOptions = {
    title: {
      text: 'Nasdaq Composite'
    },
    series: [{
      type: 'area',
      data: ncData
    }],
    ...basicChartOptions
  };

  const djChartOptions = {
    title: {
      text: 'Dow Jones Industrials'
    },
    series: [{
      type: 'area',
      data: djData
    }],
    ...basicChartOptions
  };

  const spChartOptions = {
    title: {
      text: 'S&P 500'
    },
    series: [{
      type: 'area',
      data: spData
    }],
    ...basicChartOptions
  };

  return (
    <Grid container className={classes.root}>
      <Grid container spacing={2} direction="row" justify="flex-start">
        {account &&
          <Grid item sm={6}>
            <Card className={classes.card}>
              <CardContent>
                <AccountBalanceIcon fontSize="large" className={classes.icon}/>
                <Typography className={classes.pos} variant="h5" component="h2">
                  Account {account.accountId}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Type: {accountType}
                </Typography>
                <div className={classes.pos}>
                  <Typography color="textSecondary" variant="h5" align="right">
                    Total value: {totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </Typography>
                  <Typography className={percentChange >= 0 ? classes.changeUp: classes.changeDown} variant="h6" align="right">
                    Change: {`(${percentChange.toFixed(2)}%) ${valueChange.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
                  </Typography>
                </div>
                <Typography variant="body2" component="p" align="right">
                  Long market value: {account.currentBalances.longMarketValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Typography>
                <Typography variant="body2" component="p" align="right">
                  Money market balance: {account.currentBalances.moneyMarketFund.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        }
      </Grid>

      <Grid container className={classes.root} spacing={4} direction="row" justify="space-between">
        <Grid item sm={8} md={4} className={classes.item} align="center">
          <HighchartsReact highcharts={Highcharts} options={ncChartOptions} />
        </Grid>
        <Grid item sm={8} md={4} className={classes.item} align="center">
          <span></span>
          <HighchartsReact highcharts={Highcharts} options={djChartOptions} />
        </Grid>
        <Grid item sm={8} md={4} className={classes.item} align="center">
          <HighchartsReact highcharts={Highcharts} options={spChartOptions} />
        </Grid>
      </Grid>

      <Grid container className={classes.root} spacing={2} direction="row" justify="center">
        {transactions &&
          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={4} className={classes.tableContainer}>
              <Table className={classes.table} aria-label="table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Datetime</TableCell>
                    <TableCell align="right">Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {transactions && transactions.filter(f => f.type !== 'RECEIVE_AND_DELIVER' && f.type !== 'JOURNAL')
                  .map((t, idx) => (
                    <TableRow key={idx} className={classes.tableRow}>
                      <TableCell component="th" scope="row">
                        <Moment format="MM/DD/YYYY HH:mm:ss">{t.transactionDate}</Moment>
                      </TableCell>
                      <TableCell align="right">{getDescription(t)}</TableCell>
                      <TableCell align="right">{numberWithCommas(t.netAmount)}</TableCell>
                    </TableRow>
                  )
                )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        }
      </Grid>
    </Grid>
  );
}

export default connect(mapStateToProps, null)(Overview);