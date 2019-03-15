import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import MuiButton from '@material-ui/core/Button';
import MuiIconButton from '@material-ui/core/IconButton';


const Button = ({ children, color, variant, size, iconButton, ...rest }) => {
  switch(variant) {
    case 'success':
      color = 'primary';
      variant = null;
      break;
    case 'danger':
      color = 'default';
      variant = null;
      break;
    case 'inverse':
      color = 'inherit';
      variant = null;
      break;
  }
  
  switch(size) {
    case 'xsmall':
      size = 'small';
      break;
    case 'small':
      size = 'medium';
      break;
    case 'large':
      size = 'large';
      break;
  }
  
  if (iconButton) {
    return (
      <MuiIconButton color={color} variant={variant} size={size} {...rest}>
        {children}
      </MuiIconButton>
    );
  }
  
  return (
    <MuiButton color={color} variant={variant} size={size} {...rest}>
      {children}
    </MuiButton>
  );
};


registerComponent('Button', Button);
