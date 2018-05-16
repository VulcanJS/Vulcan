import React from 'react';
import { Checkbox } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({refFunction, inputProperties}) => 
  <Checkbox {...inputProperties} ref={refFunction} />;

registerComponent('FormComponentCheckbox', CheckboxComponent);
