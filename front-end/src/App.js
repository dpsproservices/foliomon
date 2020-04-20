import React, { useEffect, useState } from 'react';
import { Switch, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { authorize, getAccessToken, getAccounts } from './utils/api';
import { Main } from './pages';
import { RouteWithLayout, NotFound, Orders, Overview, Positions, Stocks } from './components';
import theme from './theme';
import queryString from 'query-string';
import configureStore from './redux/store';
import { Provider } from 'react-redux';

const store = configureStore();

const browserHistory = createBrowserHistory();

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh'
  }
}));

function App() {
  const classes = useStyles();
  const [token, setToken] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [isDoneAuthorizing, setIsDoneAuthorizing] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        setIsFetching(true);
        const res = await getAccessToken();
        //console.log(`Recieved access token: ${res.data}`);
        setToken(res.data);
      } catch (error) {
        console.log(error);    
      } finally {
        setIsFetching(false);
      }
    };

    if (!token) {
      getToken();
    }
  }, [isDoneAuthorizing]);

  useEffect(() => {
    const search = window.location.search;
    const value = queryString.parse(search, { decode: false });
    const { code } = value;

    const sendAuthCode = async (code) => {
      try {
        setIsFetching(true);
        await authorize(code);
        await getAccounts();
        setIsDoneAuthorizing(true);
      } catch (error) {
        console.log(error);
        setIsFetching(false);
      }
    };

    if (code) {
      sendAuthCode(code);
    }
  }, []);

  console.log(token);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Grid container className={classes.root}>
          {isFetching
            ?
              <Grid container direction="row" justify="center" alignItems="center">
                <CircularProgress size={38} />
              </Grid>
            :
              token
                ?
                  <Router history={browserHistory}>
                    <Switch>
                      <Redirect exact from="/" to="/overview" />
                      <RouteWithLayout exact path="/overview" layout={Main} component={Overview} />
                      <RouteWithLayout exact path="/positions" layout={Main} component={Positions} />
                      <RouteWithLayout exact path="/stocks/:symbol" layout={Main} component={Stocks} /> 
                      <RouteWithLayout exact path="/stocks" layout={Main} component={Stocks} /> 
                      <RouteWithLayout exact path="/orders" layout={Main} component={Orders} />
                      <RouteWithLayout exact path="/not-found" layout={Main} component={NotFound} />
                      <Redirect to="/not-found" />
                    </Switch>
                  </Router>
                :
                  <Grid container direction="row" justify="center" alignItems="center">
                    <Button variant="contained" color="primary" href={process.env.REACT_APP_AUTH_URL}>Connect</Button>
                  </Grid>
          }
        </Grid>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
