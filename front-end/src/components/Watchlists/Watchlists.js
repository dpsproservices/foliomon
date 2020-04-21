import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  getAccountWatchlists,
  createAccountWatchlist,
  deleteAccountWatchlist
} from '../../utils/api';
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
  TextField,
  DialogTitle,
  IconButton
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import Search from '../Search';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    activeAccount: state.accountId
  };
};

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(1)
  },
  addListButton: {
    float: 'right'
  },
  list: {
    width: '100%'
  },
  dialogContent: {
    height: '400px'
  }
}));

const Watchlists = ({ activeAccount }) => {
  const classes = useStyles();
  const [watchLists, setWatchLists] = useState();
  const [watchlistName, setWatchlistName] = useState();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [openAddListDialog, setOpenAddListDialog] = useState(false);
  const [refreshWatchlists, setRefreshWatchlists] = useState(false);
  const [alertMessage, setAlertMessage] = useState();

  const watchListNameError = !watchlistName || watchlistName.trim() === '';
  const watchListItemsError = !watchlistItems || watchlistItems.length === 0;

  const handleSelect = useCallback(async (symbol) => {
    try {
      setWatchlistItems([ ...watchlistItems, { instrument: { symbol, assetType: 'EQUITY' } }]);
    } catch (error) {
      console.log(error);
    }
  }, [watchlistItems]);

  const handleCloseAddList = () => {
    setOpenAddListDialog(false);
  };

  const handleDeleteItem = (event) => {
    const idx = event.currentTarget.id;
    const newItems = [ ...watchlistItems ];
    newItems.splice(idx, 1);
    setWatchlistItems(newItems);
  };

  const handleDeleteListClick = async (event) => {
    const watchlistId = event.currentTarget.id;
    try {
      await deleteAccountWatchlist(activeAccount, watchlistId);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshWatchlists(!refreshWatchlists);
    }
  };

  const handleAddList = async () => {
    const req = {
      name: watchlistName,
      watchlistItems
    }
    try {
      setAlertMessage();
      await createAccountWatchlist(activeAccount, req);
      setOpenAddListDialog(false);
      setRefreshWatchlists(!refreshWatchlists);
      setWatchlistName('');
    } catch (error) {
      console.log(error);
      setAlertMessage(error.message);
    }
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
        if (activeAccount && activeAccount !== '') {
          const res = await getAccountWatchlists(activeAccount);
          console.log(res.data);
          setWatchLists(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getWatchlistsData();
  }, [activeAccount, refreshWatchlists]);

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
            <IconButton id={w.watchlistId} edge="end" aria-label="delete-list" size="small" style={{ float: 'right' }} onClick={handleDeleteListClick}>
              <DeleteForeverIcon />
            </IconButton>
          </ListSubheader>
          {w.watchlistItems.map((item, idx) => (
            <Fragment>
              <ListItem key={item.sequenceId}>
                <Link to={`/stocks/${item.instrument.symbol}`}>
                  {item.instrument.symbol}
                </Link>
                <ListItemSecondaryAction>
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
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            <form noValidate autoComplete="off">
            <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="watchlist-input"
                  autoComplete="off"
                  value={watchlistName}
                  onChange={handleInput}
                  error={watchListNameError}
                  label="Name"
                  helperText={watchListNameError ? 'Name cannot be blank.' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Search onSelect={handleSelect} />
              </Grid>
            </Grid>
            </form>
          </DialogContentText>
          <List className={classes.list}>
            {watchlistItems.length === 0
              ?
                'Add items...'
              :
                watchlistItems.map((item, idx) => (
                <Fragment>
                  <ListItem key={idx}>
                    <ListItemText primary={item.instrument.symbol}/>
                    <ListItemSecondaryAction>
                      <IconButton id={idx} edge="end" aria-label="delete-item" size="small" onClick={handleDeleteItem}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {(idx < watchlistItems.length-1) && <Divider component="li" />}
                </Fragment>
            ))}
            </List>
        </DialogContent>
        <Grid container spacing={2} direction="row" justify="center" alignItems="center">
          <Grid item xs={6}>
            {alertMessage ? <MuiAlert elevation={2} variant="filled" severity="error">{alertMessage}</MuiAlert> : null}
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={handleCloseAddList} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddList} color="primary" disabled={watchListNameError || watchListItemsError}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default connect(mapStateToProps, null)(Watchlists);