import React from 'react';
import Button from 'react-bootstrap/Button';
import { registerComponent } from 'meteor/vulcan:lib';

const BootstrapButton = ({ children, variant, size, iconButton, ...rest }) => 
  <Button variant={variant} size={size} {...rest}>{children}</Button>;

registerComponent('Button', BootstrapButton);