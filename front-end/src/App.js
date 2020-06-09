import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

//import PrivateRoute from './privateRoute';
import { Login, Logout } from './components';
import { Register, Setup2fa } from './components';
import { Test } from './components';
//import { Main, RouteWithLayout } from './components';
//import { Overview, Positions, Orders, Stocks } from './components';
import { NotFound } from './components';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Login} />
            {/* <Redirect exact from="/" to="/overview" /> */}

            <Route exact path="/register" component={Register} />

            <Route exact path='/setup2fa' component={Setup2fa} />

            <Route exact path="/login" component={Login} />
            {/* <Route path='/forgot' component={ForgotComponent} /> */}

            {/* <PrivateRoute path='/logout' component={Logout} /> */}
            <Route exact path='/logout' component={Logout} />

            <Route exact path='/test' component={Test} />

            {/* <RouteWithLayout exact path="/overview" layout={Main} component={Overview} />
            <RouteWithLayout exact path="/positions" layout={Main} component={Positions} />
            <RouteWithLayout exact path="/orders" layout={Main} component={Orders} />
            <RouteWithLayout exact path="/stocks/:symbol" layout={Main} component={Stocks} />
            <RouteWithLayout exact path="/stocks" layout={Main} component={Stocks} /> */}

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