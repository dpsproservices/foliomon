import React, { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getOrders } from '../../utils/api';

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
  }
}));

const Orders = () => {
  const [orders, setOrdersData] = useState();
  const classes = useStyles();

  useEffect(() => {
    const getOrdersData = async () => {
      try {
        const res = await getOrders();
        console.log(res.data);
        setOrdersData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getOrdersData();
  }, []);

  const convertCase = (str) => {
    if (!str) return;

    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Grid container className={classes.root} spacing={2} direction="row" alignItems="flex-start" justify="center">
      <Grid item xs={12}>
        <TableContainer component={Paper} elevation={4} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Instruction</TableCell>
                <TableCell align="right">Session</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">Type</TableCell>
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
                  <TableCell component="th" scope="row">{symbol}</TableCell>
                  <TableCell align="right">{convertCase(instruction)}</TableCell>
                  <TableCell align="right">{convertCase(o.session)}</TableCell>
                  <TableCell align="right">{convertCase(o.duration)}</TableCell>
                  <TableCell align="right">{convertCase(o.orderType)}</TableCell>
                  <TableCell align="right">{o.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{o.quantity}</TableCell>
                  <TableCell align="right">{o.filledQuantity}</TableCell>
                  <TableCell align="right">{o.status}</TableCell>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default Orders;
