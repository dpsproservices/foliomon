import React, { Fragment } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Divider
} from '@material-ui/core';

const Headlines = ({ headlines }) => {

    return (
      <List subheader={<ListSubheader>News Headlines</ListSubheader>}>
        {headlines && headlines.length > 0 && headlines.map((h, idx) => (
          <Fragment key={h.sequence.toString()}>
            <ListItem>
              <ListItemText primary={h.headline}/>
              <ListItemSecondaryAction>
              </ListItemSecondaryAction>
            </ListItem>
            {(idx < headlines.length-1) && <Divider component="li" />}
          </Fragment>
        ))}
      </List>
    );
};

export default Headlines;