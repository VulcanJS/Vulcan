import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


const UrlComponent = ({ refFunction, ...properties }) =>
  <MuiInput {...properties} ref={refFunction} type="url" />;


registerComponent('FormComponentUrl', UrlComponent);
