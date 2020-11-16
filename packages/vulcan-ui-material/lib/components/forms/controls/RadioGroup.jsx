import React from 'react';
import FormRadioGroup from '../base-controls/FormRadioGroup';
import { registerComponent } from 'meteor/vulcan:core';


const RadioGroupComponent = ({ refFunction, ...properties }) => {
  return <FormRadioGroup {...properties} ref={refFunction}/>;
};


registerComponent('FormComponentRadioGroup', RadioGroupComponent);
