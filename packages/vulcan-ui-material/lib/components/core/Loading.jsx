import React from 'react';
import { replaceComponent } from 'meteor/vulcan:core';
import CircularProgress from '@material-ui/core/CircularProgress';

function Loading(props) {
  return <CircularProgress {...props} />;
}

replaceComponent('Loading', Loading);
