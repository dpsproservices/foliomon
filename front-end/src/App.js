import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { authorize, getAccessToken } from './utils/api';
import { Main, Connect } from './pages';
import theme from './theme';
import queryString from 'query-string'

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
      {!isFetching && token ? <Main /> : <Connect />}
    </ThemeProvider>
  );
}

export default App;
