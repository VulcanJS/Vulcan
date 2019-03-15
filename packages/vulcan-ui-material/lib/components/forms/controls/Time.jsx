import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';


export const styles = theme => ({
  
  '@global': {
    'input[type=time]::-ms-clear, input[type=time]::-ms-reveal': {
      display: 'none',
      width: 0,
      height: 0,
    },
    'input[type=time]::-webkit-search-cancel-button': {
      display: 'none',
      '-webkit-appearance': 'none',
    },
    'input[type="time"]::-webkit-clear-button': {
      display: 'none',
      '-webkit-appearance': 'none',
    },
    
    'input[type="time"]::-webkit-inner-spin-button,input[type="time"]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  
});


const TimeComponent = ({ refFunction, classes, ...properties }) =>
  <MuiInput {...properties} ref={refFunction} type="time"/>;


registerComponent('FormComponentTime', TimeComponent, [withStyles, styles]);
