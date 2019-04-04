import React from 'react';
import MuiPicker from '../base-controls/MuiPicker';
import { registerComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';


export const styles = theme => ({
  
  '@global': {
    'input[type=date]::-ms-clear, input[type=date]::-ms-reveal': {
      display: 'none',
      width: 0,
      height: 0,
    },
    'input[type=date]::-webkit-search-cancel-button': {
      display: 'none',
      '-webkit-appearance': 'none',
    },
    'input[type="date"]::-webkit-clear-button': {
      display: 'none',
      '-webkit-appearance': 'none',
    },
    
    'input[type="date"]::-webkit-inner-spin-button,input[type="date"]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  
});

const DateComponent = ({ refFunction, classes, ...properties }) =>
  <MuiPicker {...properties} {...classes} ref={refFunction}/>;

registerComponent('FormComponentDate', DateComponent, [withStyles, styles]);
