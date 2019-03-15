import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


const NumberComponent = ({ refFunction, ...properties }) =>
  <MuiInput {...properties} ref={refFunction} type="number" />;


registerComponent('FormComponentNumber', NumberComponent);
