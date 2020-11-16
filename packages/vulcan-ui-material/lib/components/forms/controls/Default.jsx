import React from 'react';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';


const Default = ({ refFunction, ...properties }) =>
  <FormInput {...properties} ref={refFunction}/>;


registerComponent('FormComponentDefault', Default);
registerComponent('FormComponentText', Default);
