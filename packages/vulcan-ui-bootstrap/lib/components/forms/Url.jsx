import React from 'react';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const UrlComponent = ({refFunction, inputProperties, ...properties}) => <Input ref={refFunction} {...inputProperties} type="url" />

registerComponent('FormComponentUrl', UrlComponent);