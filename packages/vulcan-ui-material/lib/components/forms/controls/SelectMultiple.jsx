import React from 'react';
import FormSelect from '../base-controls/FormSelect';
import { registerComponent } from 'meteor/vulcan:core';


const SelectMultiple = ({ refFunction, ...properties }) => {
  return <FormSelect {...properties} multiple={true} ref={refFunction}/>;
};


registerComponent('FormComponentSelectMultiple', SelectMultiple);
