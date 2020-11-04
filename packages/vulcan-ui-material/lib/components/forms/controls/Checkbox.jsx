import React from 'react';
import SwitchBase from '../base-controls/SwitchBase';
import MuiCheckbox from '../base-controls/MuiCheckbox';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({ variant, refFunction, ...properties }) =>
  variant === 'checkbox' ?
    <MuiCheckbox {...properties} ref={refFunction} /> :
    <SwitchBase {...properties} ref={refFunction} />;

registerComponent('FormComponentCheckbox', CheckboxComponent);
