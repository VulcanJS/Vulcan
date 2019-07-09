import React from 'react';
import { addCallback } from 'meteor/vulcan:core';
import JssProvider from 'react-jss/lib/JssProvider';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createGenerateClassName from '@material-ui/core/styles/createGenerateClassName';
import { getCurrentTheme } from '../modules/themes';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssCleanup from '../components/theme/JssCleanup';

function wrapWithMuiTheme(app, { context }) {
  const sheetsRegistry = new SheetsRegistry();
  context.sheetsRegistry = sheetsRegistry;

  const sheetsManager = new Map();

  const theme = getCurrentTheme();
  return (
    <JssProvider registry={sheetsRegistry} disableStylesGeneration={true}>
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager} disableStylesGeneration={true}>
        <JssCleanup>{app}</JssCleanup>
      </MuiThemeProvider>
    </JssProvider>
  );
}

function wrapWithMuiStyleGenerator(app, { context }) {
  const sheetsRegistry = new SheetsRegistry();
  context.sheetsRegistry = sheetsRegistry;

  const sheetsManager = new Map();

  const theme = getCurrentTheme();

  const generateClassName = createGenerateClassName({ seed: '' });

  return (
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
        <JssCleanup>{app}</JssCleanup>
      </MuiThemeProvider>
    </JssProvider>
  );
}

function injectJss(sink, { context }) {
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
