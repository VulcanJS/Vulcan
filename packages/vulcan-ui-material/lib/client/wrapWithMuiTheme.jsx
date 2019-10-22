import React from 'react';
import { addCallback, registerComponent, Components } from 'meteor/vulcan:core';
import { ThemeProvider } from '@material-ui/core/styles';
import { getCurrentTheme } from '../modules/themes';
import JssCleanup from '../components/theme/JssCleanup';

class AppThemeProvider extends React.Component {
  render() {
    const theme = getCurrentTheme();
    return (
      <ThemeProvider theme={theme}>
        <JssCleanup>{this.props.children}</JssCleanup>
      </ThemeProvider>
    );
  }
}

registerComponent('ThemeProvider', AppThemeProvider);

function wrapWithMuiTheme(app) {
  return <Components.ThemeProvider>{app}</Components.ThemeProvider>;
}

addCallback('router.client.wrapper', wrapWithMuiTheme);
