import React from 'react';
import { CheckboxGroup } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxGroupComponent = ({refFunction, inputProperties}) => 
  <CheckboxGroup {...inputProperties} ref={refFunction} />;

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
