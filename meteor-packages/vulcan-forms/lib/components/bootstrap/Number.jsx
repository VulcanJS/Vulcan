import React from 'react';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const NumberComponent = ({refFunction, ...properties}) => <Input {...properties} ref={refFunction} type="number" />

registerComponent('FormComponentNumber', NumberComponent);