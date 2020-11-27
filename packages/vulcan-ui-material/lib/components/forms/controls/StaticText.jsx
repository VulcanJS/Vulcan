import React from 'react';
import FormText from '../base-controls/FormText';
import { registerComponent } from 'meteor/vulcan:core';


const StaticText = ({ refFunction, ...properties }) =>
  <FormText {...properties} ref={refFunction}/>;


registerComponent('FormComponentStaticText', StaticText);
