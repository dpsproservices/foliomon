import React, { Fragment, useEffect, useState } from 'react';
import { getAllWatchlists } from '../../utils/api';
import {
  List,
  Grid,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Divider,
  IconButton
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(1)
  },
  addListButton: {
    float: 'right'
  },
  list: {
    width: '100%'
  }
}));

const Watchlists = () => {
  const classes = useStyles();
  const [watchLists, setWatchLists] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllWatchlists();
        console.log(res.data);
        setWatchLists(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <Paper elevation={4} className={classes.paper}>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
        <Grid item xs={6}>
          <Typography className={classes.title} variant="h6">Watchlists</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <IconButton edge="end" aria-label="add-list" size="small">
            <AddBoxIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
      {watchLists && watchLists.map(w => (
        <List className={classes.list}>
          <ListSubheader>
            {w.name}
            <IconButton edge="end" aria-label="edit-list" size="small">
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete-list" size="small">
              <DeleteForeverIcon />
            </IconButton>
          </ListSubheader>
          
          
          {w.watchlistItems.map((item, idx) => (
            <Fragment>
              <ListItem key={item.sequenceId}>
                <ListItemText primary={item.instrument.symbol}/>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete-item" size="small">
                    <DeleteForeverIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {(idx < w.watchlistItems.length-1) && <Divider component="li" />}
            </Fragment>
          ))}
        </List>
      ))}
      </Grid>
    </Paper>
  );
};

export default Watchlists;