import React from 'react';
import MuiSelect from '../base-controls/MuiSelect';
import { registerComponent } from 'meteor/vulcan:core';


const SelectComponent = ({ refFunction, inputProperties, ...properties }) => {
  const noneOption = { label: '', value: '' };
  const options = [noneOption, ...inputProperties.options];
  
  return <MuiSelect inputProperties={inputProperties} {...properties} options={options} ref={refFunction}/>;
};


registerComponent('FormComponentSelect', SelectComponent);
