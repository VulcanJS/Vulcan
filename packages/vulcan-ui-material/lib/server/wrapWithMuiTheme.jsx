import React from 'react';
import { addCallback, Components } from 'meteor/vulcan:core';
import { ServerStyleSheets as MuiServerStyleSheets } from '@mui/styles';

function wrapWithMuiTheme(app, { context, apolloClient }) {
  // LEGACY: this supports the old, deprecated "makeStyles" syntax
  // TODO: remove when all makeStyles are removed from the app
  // will spawn a StylesProvider automatically during render
  // replaces the manual setup of JSSProvider
  // @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-styles/src/ServerStyleSheets/ServerStyleSheets.js
  const sheets = new MuiServerStyleSheets({ disableGeneration: true });
  context.sheetsRegistry = sheets;

  return sheets.collect(
    <Components.StylesManager disableGeneration={true} >
      <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
    </Components.StylesManager>
  );
}

function wrapWithMuiStyleGenerator(app, { context, apolloClient }) {
  // MUI legacy makeStyles with JSS
  // TODO: remove when getting rid of all makeStyles
  const sheets = new MuiServerStyleSheets();
  context.sheetsRegistry = sheets;

  return sheets.collect(
    <Components.StylesManager >
      <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
    </Components.StylesManager>
  );
}

function injectJss(sink, { context }) {
  // LEGACY add mui JSS based styles to the HTML header
  const sheets = context.sheetsRegistry.toString();
  sink.appendToHead(`<style id="jss-server-side">${sheets}</style>`);
  return sink;
}

// only run during Apollo's data collection, will provide the theme but won't generate the styles
addCallback('router.server.dataWrapper', wrapWithMuiTheme);
// only run during actual rendering, will both provide the theme and generate the styles
addCallback('router.server.renderWrapper', wrapWithMuiStyleGenerator);

// inject the <style> tag after rendering
addCallback('router.server.postRender', injectJss);
