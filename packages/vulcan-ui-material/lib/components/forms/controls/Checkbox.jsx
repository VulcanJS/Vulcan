import React from 'react';
import MuiSwitch from '../base-controls/MuiSwitch';
import { registerComponent } from 'meteor/vulcan:core';


const CheckboxComponent = ({ refFunction, inputProperties }) =>
  <MuiSwitch {...inputProperties} ref={refFunction}/>;


registerComponent('FormComponentCheckbox', CheckboxComponent);
