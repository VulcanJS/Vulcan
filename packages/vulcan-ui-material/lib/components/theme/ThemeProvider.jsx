import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { getCurrentTheme } from '../../modules/';
import { ThemeProvider } from '@mui/material/styles';

const AppThemeProvider = ({ children }) => {
  const theme = getCurrentTheme();
  // @see https://styled-components.com/docs/advanced#server-side-rendering
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

registerComponent('ThemeProvider', AppThemeProvider);
