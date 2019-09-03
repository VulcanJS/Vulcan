import React from 'react';
import MuiSelect from '../base-controls/MuiSelect';
import { registerComponent } from 'meteor/vulcan:core';


const SelectComponent = ({ refFunction, ...properties }) => {
  const noneOption = { label: '', value: '' };
  const options = [noneOption, ...properties.options];
  
  return <MuiSelect {...properties} options={options} ref={refFunction}/>;
};


registerComponent('FormComponentSelect', SelectComponent);
