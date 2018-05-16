import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import { registerComponent } from 'meteor/vulcan:lib';

const BootstrapAlert = ({ children, variant,  ...rest }) => 
  <Alert bsStyle={variant} {...rest}>{children}</Alert>

registerComponent('Alert', BootstrapAlert);