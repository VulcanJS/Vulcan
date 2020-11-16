import React from 'react';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';


const NumberComponent = ({ refFunction, ...properties }) =>
  <FormInput {...properties} ref={refFunction} type="number" />;


registerComponent('FormComponentNumber', NumberComponent);
