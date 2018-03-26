import React from 'react';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const Default = ({refFunction, inputProperties, ...properties}) => <Input {...inputProperties} ref={refFunction} type="text" />

registerComponent('FormComponentDefault', Default);