import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


const UrlComponent = ({ refFunction, inputProperties }) =>
  <MuiInput {...inputProperties} ref={refFunction} type="url" />;


registerComponent('FormComponentUrl', UrlComponent);
