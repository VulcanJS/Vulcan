import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import { getCurrentTheme } from '../../modules/';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import JssCleanup from './JssCleanup';

const AppThemeProvider = ({ children }) => {
  const theme = getCurrentTheme();
  // @see https://styled-components.com/docs/advanced#server-side-rendering
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <JssCleanup>{children}</JssCleanup>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

registerComponent('ThemeProvider', AppThemeProvider);
