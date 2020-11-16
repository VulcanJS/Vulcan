import React from 'react';
import FormCheckboxGroup from '../base-controls/FormCheckboxGroup';
import { registerComponent } from 'meteor/vulcan:core';


const CheckboxGroupComponent = ({ refFunction, ...properties }) =>
  <FormCheckboxGroup {...properties} ref={refFunction}/>;


registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
