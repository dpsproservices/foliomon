import React, { Fragment } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@material-ui/core';

const Headlines = ({ headlines }) => {

    return (
      <List>
          {headlines && headlines.map((h, idx) => (
            <Fragment>
              <ListItem>
                <ListItemText primary="Dividend Amount/Yield"/>
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