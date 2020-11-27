import React from 'react';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';


const Password = ({ refFunction, ...properties }) =>
  <FormInput {...properties} ref={refFunction} type='password'/>;


registerComponent('FormComponentPassword', Password);
