import React, { useEffect, useState, useRef } from 'react';
import { getAccountPositions, getAccounts, getUser } from '../../utils/api';
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
  },
  upTick: {
    color: colors.green[400]
  },
  downTick: {
    color: colors.red[500]
  }
}));

var ws;
var requestid = 0;

const Positions = () => {
  const isMounted = useRef(null);
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

  const getCredentials = (user) => {
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

    return jsonToQueryString(credentials);
  };

  useEffect(() => {
    // executed when component mounted
    isMounted.current = true;
    return () => {
      // executed when unmounted
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (ws && user && isLoggedIn && !isMounted.current) {
        const logout = {
          "requests": [
            {
              "service": "ADMIN",
              "command": "LOGOUT",
              "requestid": requestid++,
              "account": user.accounts[0].accountId,
              "source": user.streamerInfo.appId,
              "parameters": {
                  "credential": getCredentials(user),
                  "token": user.streamerInfo.token,
                  "version": "1.0"
              }
            }
          ]
        };
        console.log("Logging out...")
        ws.send(JSON.stringify(logout));
      };
    }
  }, [user, isLoggedIn]);

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

      const request = {
        "requests": [
          {
            "service": "ADMIN",
            "command": "LOGIN",
            "requestid": requestid++,
            "account": user.accounts[0].accountId,
            "source": user.streamerInfo.appId,
            "parameters": {
                "credential": getCredentials(user),
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
          && message.response[0].service === 'ADMIN' && message.response[0].command === 'LOGOUT'
          && message.response[0].content.code === 0) {
            if (isMounted.current) setIsLoggedIn(false);
            ws.close();
        }

        if (!isMounted.current) return;

        if (message.response && message.response.length === 1
          && message.response[0].service === 'ADMIN' && message.response[0].command === 'LOGIN'
          && message.response[0].content.code === 0) {
            setIsLoggedIn(true);
        }

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
                const bidDirection = bidPrice > prevBidPrice ? 'up' : bidPrice == prevBidPrice ? 'none' : 'down';
                const askDirection = askPrice > prevAskPrice ? 'up' : askPrice == prevAskPrice ? 'none' : 'down';;
                const lastDirection = lastPrice > prevLastPrice ? 'up' : lastPrice == prevLastPrice ? 'none' : 'down';;
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
          {accounts && accounts.map(a => <MenuItem value={a.accountId} key={a._id}>{a.accountId}</MenuItem>)}
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
                <TableCell align="right">Avg. Price $</TableCell>
                <TableCell align="right">Bid Price $</TableCell>
                <TableCell align="right">Ask Price $</TableCell>
                <TableCell align="right">Last Price $</TableCell>
                <TableCell align="right">Market Value $</TableCell>
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
                      {symbol}
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

    </Grid>
  );
}

export default Positions;
