import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import { getCurrentTheme } from '../../modules/';
import { ThemeProvider } from '@material-ui/core/styles';
import JssCleanup from './JssCleanup';

const AppThemeProvider = ({ children }) => {
  const theme = getCurrentTheme();
  return (
    <ThemeProvider theme={theme}>
      <JssCleanup>{children}</JssCleanup>
    </ThemeProvider>
  );
};

registerComponent('ThemeProvider', AppThemeProvider);
