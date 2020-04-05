import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../utils/api';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';

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
  }
});

const Overview = () => {
   const [accounts, setAccounts] = useState();
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

  return (
    <Grid container className={classes.root} spacing={2} direction="row" justify="center">
      {accounts && accounts.map(a => (
        <Grid item xs={11}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Account
              </Typography>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Type: {a.type}
              </Typography>
              
              <Typography className={classes.pos} color="textSecondary">
                Total value: ${a.currentBalances.liquidationValue.toFixed(2)}
              </Typography>
              <Typography variant="body2" component="p">
                Long market value: ${a.currentBalances.longMarketValue.toFixed(2)}
              </Typography>
              <Typography variant="body2" component="p">
                Money market balance: ${a.currentBalances.moneyMarketFund.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Overview;
