import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


export const getUrl = function (value, props) {
  if (!value) return value;
  if (typeof value !== 'string') {
    value = String(value);
  }
  if ('mailto:'.startsWith(value)) return 'mailto:';
  return !value.startsWith('mailto:') ? 'mailto:' + value : value;
};


const EmailComponent = ({ refFunction, ...properties }) =>
  <MuiInput {...properties} ref={refFunction} type="email" getUrl={getUrl}/>;


registerComponent('FormComponentEmail', EmailComponent);
