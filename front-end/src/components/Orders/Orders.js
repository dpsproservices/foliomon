import React, { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Paper
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { getOrders, getAccountPositions } from '../../utils/api';
import { convertCase } from '../../utils/utils';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    activeAccount: state.accountId
  };
};

const useStyles = makeStyles(theme => ({
  root: {
    width: 'calc(100vw - 240px)',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100vw - 100px)'
    }
  },
  table: {
    minWidth: 650
  },
  tableContainer: {
    margin: '25px'
  },
  tableRow: {
    '&:nth-child(even)': { background: '#f5f5f5' }
  },
  tab: {
    //minWidth: 80,
    //width: 80
  },
  green: {
    color: 'green'
  },
  red: {
    color: 'red'
  }
}));

const Orders = ({ activeAccount }) => {
  const [orders, setOrders] = useState();
  const [positions, setPositions] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    const getOrdersData = async () => {
      try {
        const res = await getOrders();
        console.log(res.data);
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getOrdersData();
  }, []);

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

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const convertDuration = (duration) => {
    switch(duration.toUpperCase()) {
      case "GOOD_TILL_CANCEL":
        return "GTC";
      case "DAY":
        return "Day";
      case "FILL_OR_KILL":
        return "FOK";
      default:
        return duration;
    }
  };

  const getStopOrder = (symbol) => {
    const stopOrders = orders && orders.filter(o => ['WORKING','QUEUED'].includes(o.status) &&
      o.orderLegCollection[0].instrument.symbol === symbol
    );
    if (stopOrders.length > 0) return stopOrders[0];

    return null;
  };

  return (
    <Grid container className={classes.root} spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
      <Grid>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="tabs"
        >
          <Tab label="All" classes={{ root: classes.tab }} />
          <Tab label="Stop Coverage" classes={{ root: classes.tab }} />
        </Tabs>
      </Grid>
      <Grid item xs={10}>
      {selectedTab === 0 &&
        <TableContainer component={Paper} elevation={4} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Instruction</TableCell>
                <TableCell align="right">Session</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Stop Price $</TableCell>
                <TableCell align="right">Price $</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Filled Quantity</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {orders && orders.map(o => {    
              const { instruction } = o.orderLegCollection[0];
              const { symbol } = o.orderLegCollection[0].instrument;
              return (
                <TableRow key={o.orderId} className={classes.tableRow}>
                  <TableCell component="th" scope="row">
                    <Link to={`/stocks/${symbol}`}>
                      {symbol}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{convertCase(instruction)}</TableCell>
                  <TableCell align="right">{convertCase(o.session)}</TableCell>
                  <TableCell align="right">{convertDuration(o.duration)}</TableCell>
                  <TableCell align="right">{convertCase(o.orderType)}</TableCell>
                  <TableCell align="right">{o.stopPrice && o.stopPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">{o.price && o.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{o.quantity}</TableCell>
                  <TableCell align="right">{o.filledQuantity}</TableCell>
                  <TableCell align="right">{o.status}</TableCell>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>
        </TableContainer>
      }
      {selectedTab === 1 &&
        <TableContainer component={Paper} elevation={4} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Avg. Price $</TableCell>
              <TableCell>Covered</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Stop Price $</TableCell>
              <TableCell>Price $</TableCell>
              <TableCell>Order Qty.</TableCell>
              <TableCell>Filled Qty.</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {positions && positions.map(p => {
            const { symbol } = p.instrument;
            const stopOrder = getStopOrder(symbol);
            let orderType = null;
            let orderPrice = null;
            let stopPrice = null;
            let orderQuantity = null;
            let filledQuantity = null;
            let orderStatus = null;
            if (stopOrder) {
              orderType = convertCase(stopOrder.orderType);
              stopPrice = stopOrder.stopPrice && stopOrder.stopPrice.toFixed(2);
              orderPrice = stopOrder.price && stopOrder.price.toFixed(2);
              orderQuantity = stopOrder.quantity;
              filledQuantity = stopOrder.filledQuantity;
              orderStatus = stopOrder.status;
            }
            return (
              <TableRow key={symbol} className={classes.tableRow}>
                <TableCell component="th" scope="row">
                  <Link to={`/stocks/${symbol}`}>
                    {symbol}
                  </Link>
                </TableCell>
                <TableCell>{p.longQuantity}</TableCell>
                <TableCell>{p.averagePrice}</TableCell>
                <TableCell>{stopOrder ? <CheckIcon className={classes.green} /> : <CloseIcon className={classes.red} />}</TableCell>
                <TableCell align="right">{orderType}</TableCell>
                <TableCell align="right">{stopPrice}</TableCell>
                <TableCell align="right">{orderPrice}</TableCell>
                <TableCell align="right">{orderQuantity}</TableCell>
                <TableCell align="right">{filledQuantity}</TableCell>
                <TableCell align="right">{orderStatus}</TableCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </TableContainer>
    }
      </Grid>
    </Grid>
  );
}

export default connect(mapStateToProps, null)(Orders);
