import React, { useEffect, useState } from 'react';
import { getAccountPositions, getAccounts, getUser } from '../../utils/api';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  Paper  } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '25px',
    height: '100vh'
  },
  table: {
    minWidth: 650
  },
  select: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  tableRow: {
    '&:nth-child(even)': { background: '#f5f5f5' }
  }
}));

var ws;
var requestid = 0;

const Positions = () => {
  const [accounts, setAccounts] = useState();
  const [positions, setPositions] = useState();
  const [prices, setPrices] = useState({});
  const [user, setUser] = useState();
  const [activeAccount, setActiveAccount] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const classes = useStyles();

  const jsonToQueryString = (json) => {
    return Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
  };

  useEffect(() => {
    if (user && isLoggedIn && positions) {
      const symbols = positions.map(p => p.instrument.symbol).toString();
      const request = {
        "requests": [
          {
            "service": "QUOTE",
            "command": "SUBS",
            "requestid": requestid++,
            "account": user.accounts[0].accountId,
            "source": user.streamerInfo.appId,
            "parameters": {
                "keys": symbols,
                "fields": "0,1,2,3"
            }
          }
        ]
      };

      ws.send(JSON.stringify(request));
    }
  }, [isLoggedIn, positions]);

  useEffect(() => {
    if (isConnected && user) {
      //Converts ISO-8601 response in snapshot to ms since epoch accepted by Streamer
      const tokenTimeStampAsDateObj = new Date(user.streamerInfo.tokenTimestamp);
      const tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();

      const credentials = {
        "userid": user.accounts[0].accountId,
        "token": user.streamerInfo.token,
        "company": user.accounts[0].company,
        "segment": user.accounts[0].segment,
        "cddomain": user.accounts[0].accountCdDomainId,
        "usergroup": user.streamerInfo.userGroup,
        "accesslevel": user.streamerInfo.accessLevel,
        "authorized": "Y",
        "timestamp": tokenTimeStampAsMs,
        "appid": user.streamerInfo.appId,
        "acl": user.streamerInfo.acl
      };

      const request = {
        "requests": [
          {
            "service": "ADMIN",
            "command": "LOGIN",
            "requestid": requestid,
            "account": user.accounts[0].accountId,
            "source": user.streamerInfo.appId,
            "parameters": {
                "credential": jsonToQueryString(credentials),
                "token": user.streamerInfo.token,
                "version": "1.0"
            }
          }
        ]
      };

      ws.send(JSON.stringify(request));
    }
  }, [isConnected]);

  useEffect(() => {

    if (user) {
      ws = new WebSocket("wss://" + user.streamerInfo.streamerSocketUrl + "/ws");

      ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected');
        setIsConnected(true);
      };

      ws.onmessage = evt => {
        // listen to data sent from the websocket server
        const message = JSON.parse(evt.data);
        console.log(message);
        if (message.response && message.response.length === 1
          && message.response[0].service === 'ADMIN' && message.response[0].command === 'LOGIN'
          && message.response[0].content.code === 0) {
            setIsLoggedIn(true);
        }

        if (message.data && message.data.length === 1
          && message.data[0].service === 'QUOTE') {
            const { content } = message.data[0];
            content && content.forEach(row => {
              const bidPrice = row['1'];
              const askPrice = row['2'];
              const lastPrice = row['3'];
              const symbol = row.key;
              const newPrice = { bidPrice, askPrice, lastPrice };
              setPrices(prevPrices => ({ ...prevPrices, [symbol]: newPrice }));
            });
          }
      };

      ws.onclose = () => {
        console.log('disconnected');
      };
    }
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAccounts();
        console.log(res.data.accounts);
        setAccounts(res.data.accounts);

        const userRes = await getUser();
        console.log(userRes.data);
        setUser(userRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        if (activeAccount && activeAccount !== '') {
          const res = await getAccountPositions(activeAccount);
          console.log(res.data.securitiesAccount.positions);
          const newPositions = res.data.securitiesAccount.positions.filter(p => p.instrument.symbol !== 'MMDA1');
          setPositions(newPositions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [activeAccount]);

  const handleChange = (event) => {
    setActiveAccount(event.target.value);
  };

  return (
    <Grid container className={classes.root} spacing={2} direction="row" justify="center">
      <Grid item xs={11}>
        <InputLabel id="account-select-label">Account</InputLabel>
        <Select
          className={classes.select}
          labelId="account-select-label"
          id="account-select"
          value={activeAccount}
          onChange={handleChange}
        >
          <MenuItem value=""><em>Select</em></MenuItem>
          {accounts && accounts.map(a => <MenuItem value={a.accountId}>{a.accountId}</MenuItem>)}
        </Select>
      </Grid>

      <Grid item xs={11}>
        <TableContainer component={Paper} elevation={4}>
          <Table className={classes.table} aria-label="table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Long Quantity</TableCell>
                <TableCell align="right">Short Quantity</TableCell>
                <TableCell align="right">Avg. Price</TableCell>
                <TableCell align="right">Bid Price</TableCell>
                <TableCell align="right">Ask Price</TableCell>
                <TableCell align="right">Last Price</TableCell>
                <TableCell align="right">Market Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions && positions.map((row) => {
                const { symbol } = row.instrument;
                const symbolPrices = prices[symbol];
                const { bidPrice, askPrice, lastPrice } = symbolPrices || {};
                return (
                  <TableRow key={symbol} className={classes.tableRow}>
                    <TableCell component="th" scope="row">
                      {symbol}
                    </TableCell>
                    <TableCell align="right">{row.longQuantity}</TableCell>
                    <TableCell align="right">{row.shortQuantity}</TableCell>
                    <TableCell align="right">${row.averagePrice.toFixed(2)}</TableCell>
                    <TableCell align="right">${bidPrice && bidPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">${askPrice && askPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">${lastPrice && lastPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">${row.marketValue.toFixed(2)}</TableCell>
                  </TableRow>);
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

    </Grid>
  );
}

export default Positions;
