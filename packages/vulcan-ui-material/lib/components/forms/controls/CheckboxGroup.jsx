import React from 'react';
import MuiCheckboxGroup from '../base-controls/MuiCheckboxGroup';
import { registerComponent } from 'meteor/vulcan:core';


const CheckboxGroupComponent = ({ refFunction, inputProperties }) =>
  <MuiCheckboxGroup {...inputProperties} ref={refFunction}/>;


registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
