  
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Drawer, List, ListItem, Button, colors } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ViewListIcon from '@material-ui/icons/ViewList';
import InsertChartIcon from '@material-ui/icons/InsertChart';

const useStyles = makeStyles(theme => ({
    drawer: {
      width: 240,
      //[theme.breakpoints.up('lg')]: {
        marginTop: 64,
        height: 'calc(100% - 64px)'
      //}
    },
    root: {
      backgroundColor: theme.palette.white,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: theme.spacing(2)
    },
    divider: {
      margin: theme.spacing(2, 0)
    },
    nav: {
      marginBottom: theme.spacing(2)
    },
    item: {
      display: 'flex',
      paddingTop: 0,
      paddingBottom: 0
    },
    button: {
      color: colors.blueGrey[800],
      padding: '10px 8px',
      justifyContent: 'flex-start',
      textTransform: 'none',
      letterSpacing: 0,
      width: '100%',
      fontWeight: theme.typography.fontWeightMedium
    },
    icon: {
      color: theme.palette.icon,
      width: 24,
      height: 24,
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(1)
    },
    active: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
      '& $icon': {
        color: theme.palette.primary.main
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

const Sidebar = props => {
  const { open, variant, onClose, className } = props;
  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <List className={clsx(classes.root, classes.nav)}>
        <ListItem
          className={classes.item}
          disableGutters
          key="Overview"
        >
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to="/overview"
          >
            <div className={classes.icon}><DashboardIcon /></div>
            Overview
          </Button>
        </ListItem>
        <ListItem
          className={classes.item}
          disableGutters
          key="Positions"
        >
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to="/positions"
          >
            <div className={classes.icon}><InsertChartIcon /></div>
            Positions
          </Button>
        </ListItem>
        <ListItem
          className={classes.item}
          disableGutters
          key="Orders"
        >
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to="/orders"
          >
            <div className={classes.icon}><ViewListIcon /></div>
            Orders
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;