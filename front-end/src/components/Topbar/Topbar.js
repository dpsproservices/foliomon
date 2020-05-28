import React, { useState, forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import AccountSelector from '../AccountSelector';

const useStyles = makeStyles(theme => ({
    root: {
      boxShadow: 'none',
      height: 64
    },
    toolbar: {
      height: 64
    },
    flexGrow: {
      flexGrow: 1
    },
    signOutButton: {
      marginLeft: theme.spacing(1)
    },
    accountSelector: {
      marginLeft: 240,
      [theme.breakpoints.down('xs')]: {
        marginLeft: 80
      }
    }
  }));

  const CustomRouterLink = forwardRef((props, ref) => (
    <div
      ref={ref}
      style={{ flexGrow: 1 }}
    >
      <RouterLink {...props} />
    </div>
  ));

  const Topbar = props => {
    const { className, onSidebarOpen, ...rest } = props;
  
    const classes = useStyles();
  
    const [notifications] = useState([]);
 
    return (
      <AppBar
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Toolbar disableGutters className={classes.toolbar}>
          <div className={classes.accountSelector}><AccountSelector /></div>
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <IconButton color="inherit">
              <Badge
                badgeContent={notifications.length}
                color="primary"
                variant="dot"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              className={classes.signOutButton}
              color="inherit"
              component={CustomRouterLink}
              to="/logout"
            >
              <InputIcon/>
            </IconButton>
          </Hidden>
          <Hidden lgUp>
            <IconButton
              color="inherit"
              onClick={onSidebarOpen}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  };
  
export default Topbar;