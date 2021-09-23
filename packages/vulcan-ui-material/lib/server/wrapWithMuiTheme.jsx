import React from 'react';
import { addCallback, Components } from 'meteor/vulcan:core';

function wrapWithMuiTheme(app, { context, apolloClient }) {
  // LEGACY: this supports the old, deprecated "makeStyles" syntax
  // TODO: remove when all makeStyles are removed from the app
  // will spawn a StylesProvider automatically during render
  // replaces the manual setup of JSSProvider
  // @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-styles/src/ServerStyleSheets/ServerStyleSheets.js
  return (
    <Components.StylesManager disableGeneration={true}>
      <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
    </Components.StylesManager>
  );
}

function wrapWithMuiStyleGenerator(app, { context, apolloClient }) {
  return (
    <Components.StylesManager>
      <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
    </Components.StylesManager>
  );
}
// only run during Apollo's data collection, will provide the theme but won't generate the styles
addCallback('router.server.dataWrapper', wrapWithMuiTheme);
// only run during actual rendering, will both provide the theme and generate the styles
addCallback('router.server.renderWrapper', wrapWithMuiStyleGenerator);
