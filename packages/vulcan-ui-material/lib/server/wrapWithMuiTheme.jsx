import React from 'react';
import { addCallback } from 'meteor/vulcan:core';
import {
  StylesProvider,
  ServerStyleSheets,
  ThemeProvider,
  createGenerateClassName
} from '@material-ui/core/styles';
import { getCurrentTheme } from '../modules/themes';
import JssCleanup from '../components/theme/JssCleanup';

function wrapWithMuiTheme(app, { context }) {
  const sheets = new ServerStyleSheets();
  context.sheetsRegistry = sheets;

  const theme = getCurrentTheme();

  return sheets.collect(
    <StylesProvider disableGeneration={true}>
      <ThemeProvider theme={theme}>
        <JssCleanup>{app}</JssCleanup>
      </ThemeProvider>
    </StylesProvider>
  );
}

function wrapWithMuiStyleGenerator(app, { context }) {
  const sheets = new ServerStyleSheets();
  context.sheetsRegistry = sheets;


  const theme = getCurrentTheme();

  const generateClassName = createGenerateClassName({ seed: '' });

  return sheets.collect(
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>
        <JssCleanup>{app}</JssCleanup>
      </ThemeProvider>
    </StylesProvider>
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
