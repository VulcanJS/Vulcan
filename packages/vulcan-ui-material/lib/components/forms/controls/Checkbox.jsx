import React from 'react';
import FormSwitch from '../base-controls/FormSwitch';
import FormCheckbox from '../base-controls/FormCheckbox';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({ variant, refFunction, ...properties }) =>
  variant === 'checkbox' ?
    <FormCheckbox {...properties} ref={refFunction} /> :
    <FormSwitch {...properties} ref={refFunction} />;

registerComponent('FormComponentCheckbox', CheckboxComponent);
