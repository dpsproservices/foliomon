import React, { useEffect, useState } from 'react';
import { Switch, Router, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { authorize, getAccessToken } from './utils/api';
import { Main, Connect } from './pages';
import { RouteWithLayout, NotFound, Orders, Overview, Positions } from './components';
import theme from './theme';
import queryString from 'query-string'

const browserHistory = createBrowserHistory();

function App() {
  const [token, setToken] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [isDoneAuthorizing, setIsDoneAuthorizing] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        setIsFetching(true);
        const res = await getAccessToken();
        setToken(res.data.accessToken);
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
        setIsDoneAuthorizing(true);
      } catch (error) {
        console.log(error);
      } finally {
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
      {isFetching && <CircularProgress />}
      {token
        ?
          <Router history={browserHistory}>
            <Switch>
              <Redirect exact from="/" to="/overview" />
              <RouteWithLayout exact path="/overview" layout={Main} component={Overview} />
              <RouteWithLayout exact path="/positions" layout={Main} component={Positions} /> 
              <RouteWithLayout exact path="/orders" layout={Main} component={Orders} />
              <RouteWithLayout exact path="/not-found" layout={Main} component={NotFound} />
              <Redirect to="/not-found" />
            </Switch>
          </Router>
        :
          <Connect />
      }
    </ThemeProvider>
  );
}

export default App;
