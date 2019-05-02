import React from 'react';
import MuiCheckboxGroup from '../base-controls/MuiCheckboxGroup';
import { registerComponent } from 'meteor/vulcan:core';


const CheckboxGroupComponent = ({ refFunction, ...properties }) =>
  <MuiCheckboxGroup {...properties} ref={refFunction}/>;


registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
