import React from 'react';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const UrlComponent = ({refFunction, ...properties}) => <Input ref={refFunction} {...properties} type="url" />

registerComponent('FormComponentUrl', UrlComponent);