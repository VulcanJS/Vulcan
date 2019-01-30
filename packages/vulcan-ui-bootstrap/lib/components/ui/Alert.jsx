import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { registerComponent } from 'meteor/vulcan:lib';

const BootstrapAlert = ({ children, variant,  ...rest }) => 
  <Alert variant={variant} {...rest}>{children}</Alert>;

registerComponent('Alert', BootstrapAlert);