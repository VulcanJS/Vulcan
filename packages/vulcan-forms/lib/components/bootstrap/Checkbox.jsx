import React from 'react';
import { Checkbox } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({refFunction, ...properties}) => <Checkbox {...properties} ref={refFunction} />

registerComponent('FormComponentCheckbox', CheckboxComponent);