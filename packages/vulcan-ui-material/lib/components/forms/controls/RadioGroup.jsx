import React from 'react';
import MuiRadioGroup from '../base-controls/MuiRadioGroup';
import { registerComponent } from 'meteor/vulcan:core';


const RadioGroupComponent = ({ refFunction, ...properties }) => {
  return <MuiRadioGroup {...properties} ref={refFunction}/>;
};


registerComponent('FormComponentRadioGroup', RadioGroupComponent);
