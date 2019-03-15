import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


const EmailComponent = ({ refFunction, ...properties }) =>
  <MuiInput {...properties} ref={refFunction} type="email" />;


registerComponent('FormComponentEmail', EmailComponent);
