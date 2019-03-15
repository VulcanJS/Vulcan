import React from 'react';
import { addCallback, registerComponent, Components } from 'meteor/vulcan:core';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { getCurrentTheme } from '../modules/themes';
import JssCleanup from '../components/theme/JssCleanup';

class ThemeProvider extends React.Component {
  render() {
    const theme = getCurrentTheme();
    return (
      <MuiThemeProvider theme={theme}>
        <JssCleanup>{this.props.children}</JssCleanup>
      </MuiThemeProvider>
    );
  }
}

registerComponent('ThemeProvider', ThemeProvider);

function wrapWithMuiTheme(app) {
  return (
    <Components.ThemeProvider>
      {app}
    </Components.ThemeProvider>
  );
}


addCallback('router.client.wrapper', wrapWithMuiTheme);
