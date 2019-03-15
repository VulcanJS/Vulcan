import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';


export const styles = theme => ({
  
  '@global': {
    'input[type=datetime]::-ms-clear, input[type=datetime]::-ms-reveal': {
      display: 'none',
      width: 0,
      height: 0,
    },
    'input[type=datetime]::-webkit-search-cancel-button': {
      display: 'none',
      '-webkit-appearance': 'none',
    },
    'input[type="datetime"]::-webkit-clear-button': {
      display: 'none',
      '-webkit-appearance': 'none',
    },
    
    'input[type="datetime"]::-webkit-inner-spin-button,input[type="datetime"]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  
});


const DateTimeComponent = ({ refFunction, classes, ...properties }) =>
  <MuiInput {...properties} ref={refFunction} type="datetime-local"/>;


registerComponent('FormComponentDateTime', DateTimeComponent, [withStyles, styles]);
