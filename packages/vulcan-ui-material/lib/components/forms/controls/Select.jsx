import React from 'react';
import FormSelect from '../base-controls/FormSelect';
import { registerComponent } from 'meteor/vulcan:core';


const SelectComponent = ({ refFunction, ...properties }) => {
  return <FormSelect {...properties} ref={refFunction}/>;
};


registerComponent('FormComponentSelect', SelectComponent);
