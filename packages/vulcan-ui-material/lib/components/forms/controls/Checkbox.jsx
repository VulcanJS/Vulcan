import React from 'react';
import MuiSwitch from '../base-controls/MuiSwitch';
import MuiCheckbox from '../base-controls/MuiCheckbox';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({ variant, refFunction, ...properties }) =>
  variant == 'checkbox' ? <MuiCheckbox {...properties} ref={refFunction} /> : <MuiSwitch {...properties} ref={refFunction} />;

registerComponent('FormComponentCheckbox', CheckboxComponent);
