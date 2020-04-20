import React, { Fragment, useEffect, useState } from 'react';
import { getWatchlists } from '../../utils/api';
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
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  InputLabel,
  Input,
  DialogTitle,
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
  const [watchlistName, setWatchlistName] = useState();
  const [openAddListDialog, setOpenAddListDialog] = useState(false);

  const handleCloseAddList = () => {
    setOpenAddListDialog(false);
  };

  const handleAddList = () => {

  };

  const handleInput = (event) => {
    setWatchlistName(event.target.value);
  };

  const handleAddClick = () => {
    setOpenAddListDialog(true);
  };

  useEffect(() => {
    const getWatchlistsData = async () => {
      try {
        const res = await getWatchlists();
        console.log(res.data);
        setWatchListsData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getWatchlistsData();
  }, []);

  return (
    <Paper elevation={4} className={classes.paper}>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
        <Grid item xs={6}>
          <Typography className={classes.title} variant="h6">Watchlists</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <IconButton edge="end" aria-label="add-list" size="small" onClick={handleAddClick}>
            <AddBoxIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
      {watchLists && watchLists.map(w => (
        <List className={classes.list}>
          <ListSubheader>
            {w.name}
            <IconButton edge="end" aria-label="edit-list" size="small" style={{ float: 'right' }}>
              <EditIcon />
            </IconButton>
            {/* <IconButton edge="end" aria-label="delete-list" size="small">
              <DeleteForeverIcon />
            </IconButton> */}
          </ListSubheader>
          {w.watchlistItems.map((item, idx) => (
            <Fragment>
              <ListItem key={item.sequenceId}>
                <ListItemText primary={item.instrument.symbol}/>
                <ListItemSecondaryAction>
                  {/* <IconButton edge="end" aria-label="delete-item" size="small">
                    <DeleteForeverIcon />
                  </IconButton> */}
                </ListItemSecondaryAction>
              </ListItem>
              {(idx < w.watchlistItems.length-1) && <Divider component="li" />}
            </Fragment>
          ))}
        </List>
      ))}
      </Grid>
      <Dialog onClose={handleCloseAddList} aria-labelledby="dialog" open={openAddListDialog}>
        <DialogTitle id="dialog">Add watchlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <InputLabel htmlFor="watchlist-input">Name</InputLabel>
            <Input
              fullWidth
              id="watchlist-input"
              value={watchlistName}
              onChange={handleInput}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddList} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddList} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Watchlists;