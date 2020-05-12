import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '../theme';

//import PrivateRoute from './privateRoute';
//import { SignUp } from './pages';
import { Login, Main } from '../pages';
import { RouteWithLayout, NotFound } from '../components';
import { Overview, Positions, Orders, Stocks } from '../components';

const classes = makeStyles(theme => ({
  root: {
    minHeight: '100vh'
  }
}));

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Switch>
              <Route path='/' exact={true} component={Login} />
              {/* <Redirect exact from="/" to="/overview" /> */}

              {/* <Route exact path="/register" component={SignUp} /> */}
              <Route exact path="/login" component={Login} />
              {/* <Route path='/forgot' component={ForgotComponent} /> */}

              {/* <PrivateRoute path='/logout' component={Logout} /> */}

              <RouteWithLayout exact path="/overview" layout={Main} component={Overview} />
              <RouteWithLayout exact path="/positions" layout={Main} component={Positions} />
              <RouteWithLayout exact path="/orders" layout={Main} component={Orders} />
              <RouteWithLayout exact path="/stocks/:symbol" layout={Main} component={Stocks} />
              <RouteWithLayout exact path="/stocks" layout={Main} component={Stocks} />

              <Route component={NotFound} />

              {/* <Route exact path="/not-found" component={NotFound} />
              <Redirect to="/not-found" /> */}
            </Switch>
          </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;