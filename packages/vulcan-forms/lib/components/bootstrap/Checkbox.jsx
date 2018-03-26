import React from 'react';
import { Checkbox } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({refFunction, inputProperties, ...properties}) => <Checkbox {...inputProperties} ref={refFunction} />

registerComponent('FormComponentCheckbox', CheckboxComponent);