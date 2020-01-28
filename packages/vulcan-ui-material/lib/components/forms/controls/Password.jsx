import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


const Password = ({ refFunction, ...properties }) =>
  <MuiInput {...properties} ref={refFunction} type='password'/>;


registerComponent('FormComponentPassword', Password);
