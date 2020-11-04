import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';

const FormOptionLabel = ({ option }) => {
  const { label } = option;
  return <span className="form-option-label">{label}</span>;
};

registerComponent('FormOptionLabel', FormOptionLabel);
