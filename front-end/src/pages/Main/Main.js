import React, { useState } from 'react';
import { Switch, Router, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
//import { useMediaQuery } from '@material-ui/core';
import { Sidebar, Topbar, Footer, NotFound, Orders } from '../../components';

const browserHistory = createBrowserHistory();

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = () => {
  const classes = useStyles();
  //const theme = useTheme();
  const isDesktop = true;
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
  //   defaultMatches: true
  // });
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
      [classes.root]: true,
      [classes.shiftContent]: isDesktop
    })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        <Router history={browserHistory}>
          <Switch>
          <Route path="/orders" component={Orders} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
          </Switch>
        </Router>
        <Footer />
      </main>
    </div>
  );
};

export default Main;