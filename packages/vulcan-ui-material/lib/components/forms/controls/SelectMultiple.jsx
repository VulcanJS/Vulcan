import React from 'react';
import MuiSelect from '../base-controls/MuiSelect';
import { registerComponent } from 'meteor/vulcan:core';


const SelectMultiple = ({ refFunction, ...properties }) => {
  properties.multiple = true;
  
  return <MuiSelect {...properties} ref={refFunction}/>;
};


registerComponent('FormComponentSelectMultiple', SelectMultiple);
