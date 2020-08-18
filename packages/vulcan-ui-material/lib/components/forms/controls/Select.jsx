import React from 'react';
import MuiSelect from '../base-controls/MuiSelect';
import { registerComponent } from 'meteor/vulcan:core';


const SelectComponent = ({ refFunction, ...properties }) => {
  return <MuiSelect {...properties} ref={refFunction}/>;
};


registerComponent('FormComponentSelect', SelectComponent);
