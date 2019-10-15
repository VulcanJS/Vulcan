import React from 'react';
import MuiText from '../base-controls/MuiText';
import { registerComponent } from 'meteor/vulcan:core';


const StaticText = ({ refFunction, ...properties }) =>
  <MuiText {...properties} ref={refFunction}/>;


registerComponent('FormComponentStaticText', StaticText);
