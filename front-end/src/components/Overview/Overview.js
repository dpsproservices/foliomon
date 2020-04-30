import React, { useEffect, useState } from 'react';
import { getAccount, getAccountTransactions } from '../../utils/api';
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

const mapStateToProps = state => {
  return {
    activeAccount: state.accountId
  };
};

const useStyles = makeStyles({
  root: {
    padding: '25px',
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
  }
});

const Overview = ({ activeAccount }) => {
   const [account, setAccount] = useState();
   const [transactions, setTransactions] = useState();
   const classes = useStyles();

  useEffect(() => {
    const getAccountsData = async () => {
      try {
        if (activeAccount && activeAccount !== '') {
          const accountRes = await getAccount(activeAccount);
          console.log(accountRes.data);
          const transactionsRes = await getAccountTransactions(activeAccount);
          console.log(transactionsRes.data);
          
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

  return (
    <Grid container>
      <Grid container className={classes.root} spacing={2} direction="row" alignItems="flex-start">
        {account &&
          <Grid item xs={4}>
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