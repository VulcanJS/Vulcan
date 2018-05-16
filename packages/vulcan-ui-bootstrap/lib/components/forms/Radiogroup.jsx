import React from 'react';
import { RadioGroup } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const RadioGroupComponent = ({refFunction, inputProperties, ...properties}) => <RadioGroup {...inputProperties} ref={refFunction}/>

registerComponent('FormComponentRadioGroup', RadioGroupComponent);