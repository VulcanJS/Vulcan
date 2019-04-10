import React from 'react';
import MuiSelect from '../base-controls/MuiSelect';
import { registerComponent } from 'meteor/vulcan:core';


const SelectComponent = ({ refFunction, inputProperties }) => {
  const noneOption = { label: '', value: '' };
  const options = [noneOption, ...inputProperties.options];
  
  return <MuiSelect {...inputProperties} options={options} ref={refFunction}/>;
};


registerComponent('FormComponentSelect', SelectComponent);
