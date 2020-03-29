  
import React, { forwardRef } from 'react';
import clsx from 'clsx';
//import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Drawer, List, ListItem, Button } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';

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
    }
}));

// const CustomRouterLink = forwardRef((props, ref) => (
//   <div
//     ref={ref}
//     style={{ flexGrow: 1 }}
//   >
//     <RouterLink {...props} />
//   </div>
// ));

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
      <List
      className={clsx(classes.root, className)}
      >
        <ListItem
          className={classes.item}
          disableGutters
          key="Orders"
        >
          <Button
            //activeClassName={classes.active}
            className={classes.button}
            //component={CustomRouterLink}
            href="/orders"
          >
            <div className={classes.icon}><DashboardIcon /></div>
            Orders
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;