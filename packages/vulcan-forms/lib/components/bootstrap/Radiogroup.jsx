import React from 'react';
import { RadioGroup } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const RadioGroupComponent = ({refFunction, ...properties}) => <RadioGroup {...properties} ref={refFunction}/>

registerComponent('FormComponentRadioGroup', RadioGroupComponent);