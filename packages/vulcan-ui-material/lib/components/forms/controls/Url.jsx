import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


export const scrubValue = function (value, props) {
  if (!value) return value;
  if (typeof value !== 'string') {
    value = String(value);
  }
  value = value.trim();
  if ('https://'.startsWith(value)) return 'https://';
  if ('http://'.startsWith(value)) return 'http://';
  return !value.startsWith('http://') && !value.startsWith('https://') ? 'https://' + value : value;
};


const UrlComponent = ({ refFunction, ...properties }) =>
  <MuiInput {...properties} ref={refFunction} scrubValue={scrubValue} type="url"/>;


registerComponent('FormComponentUrl', UrlComponent);
