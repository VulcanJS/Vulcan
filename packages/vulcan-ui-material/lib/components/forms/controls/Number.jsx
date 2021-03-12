import React from 'react';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';


export const scrubNumberValue = function (value, props) {
  if (!value) return value;
  if (typeof value !== 'string') {
    value = String(value);
  }
  // number should only contain digits and periods
  value = value.replace(/[^0-9.]/g, '');
  // number should not start with a period
  if (value.startsWith('.')) {
    value = `0${value}`;
  }
  // number should not contain more than one period
  const parts = value.split('.');
  if (parts.length > 1) {
    parts[0] = `${parts[0]}.`;
    value = parts.join('');
  }
  return value;
};

const NumberComponent = ({ refFunction, ...properties }) =>
  <FormInput {...properties} ref={refFunction} scrubValue={scrubNumberValue} type="number" />;


registerComponent('FormComponentNumber', NumberComponent);
