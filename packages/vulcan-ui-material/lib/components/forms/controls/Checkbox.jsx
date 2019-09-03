import React from 'react';
import MuiSwitch from '../base-controls/MuiSwitch';
import { registerComponent } from 'meteor/vulcan:core';


const CheckboxComponent = ({ refFunction, ...properties }) =>
  <MuiSwitch {...properties} ref={refFunction}/>;


registerComponent('FormComponentCheckbox', CheckboxComponent);
