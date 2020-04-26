import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../utils/api';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = makeStyles({
  root: {
    paddingTop: '25px',
    height: '100vh'
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
  }
});

const Overview = () => {
   const [accounts, setAccountsData] = useState();
   const classes = useStyles();

  useEffect(() => {
    const getAccountsData = async () => {
      try {
        const res = await getAccounts();
        console.log(res.data);
        const accountData = res.data && res.data.map(a => a.securitiesAccount);
        setAccountsData(accountData);
      } catch (error) {
        console.log(error);
      }
    };

    getAccountsData();
  }, []);

  

  return (
    <Grid container className={classes.root} spacing={2} direction="row" justify="center">
      {accounts && accounts.map(a => {
        let accountType = a.type;
        accountType = accountType[0].toUpperCase() + accountType.slice(1).toLowerCase();
        return (
          <Grid item xs={11} key={a.accountId}>
            <Card className={classes.card}>
              <CardContent>
                <AccountBalanceIcon fontSize="large" className={classes.icon}/>
                <Typography className={classes.pos} variant="h5" component="h2">
                  Account {a.accountId}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Type: {accountType}
                </Typography>
                
                <Typography className={classes.pos} color="textSecondary" align="right">
                  Total value: {a.currentBalances.liquidationValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Typography>
                <Typography variant="body2" component="p" align="right">
                  Long market value: {a.currentBalances.longMarketValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Typography>
                <Typography variant="body2" component="p" align="right">
                  Money market balance: {a.currentBalances.moneyMarketFund.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Overview;
