import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { registerComponent } from 'meteor/vulcan:lib';

const BootstrapButton = ({ children, variant, size, iconButton, ...rest }) => 
  <Button bsStyle={variant} bsSize={size} {...rest}>{children}</Button>

registerComponent('Button', BootstrapButton);