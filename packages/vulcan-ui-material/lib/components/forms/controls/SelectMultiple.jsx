import React from 'react';
import MuiSelect from '../base-controls/MuiSelect';
import { registerComponent } from 'meteor/vulcan:core';


const SelectMultiple = ({ refFunction, ...properties }) => {
  return <MuiSelect {...properties} multiple={true} ref={refFunction}/>;
};


registerComponent('FormComponentSelectMultiple', SelectMultiple);
