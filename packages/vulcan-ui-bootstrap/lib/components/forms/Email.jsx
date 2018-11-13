import React from 'react';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const EmailComponent = ({refFunction, inputProperties}) => 
  <Input {...inputProperties} ref={refFunction} type="email" />;

registerComponent('FormComponentEmail', EmailComponent);
