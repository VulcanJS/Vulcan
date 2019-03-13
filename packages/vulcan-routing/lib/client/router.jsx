import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

import { Meteor } from 'meteor/meteor';

import { InjectData } from 'meteor/vulcan:lib';
import { splitComponentRegistry } from '../modules/splitComponents';

import * as Sentry from '@sentry/browser';

const getDataPromisified = (name) => {
  return new Promise((resolve, reject)=> {
    try {
      InjectData.getData(name, (data) => resolve(data))
    } catch(err) {
      reject(err)
    }
  })
}

const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time)
  })
}

export const RouterClient = {
  run(routes, options) {
    if (!options) {
      options = {};
    }

    Meteor.startup(async () => {
      const rootElementName = options.rootElement || 'react-app';
      const rootElementType = options.rootElementType || 'div';
      const attributes = options.rootElementAttributes instanceof Array ? options.rootElementAttributes : [];
      let rootElement = document.getElementById(rootElementName);
      
      // We make sure to always wait here, since scrolling with a hash in the URL seems to only work when this method waits until
      // the rest of the app is initialized (or something like that).
      await sleep(0)
      // If there are split components specified, do them now and wait for them to load before initializing the Router
      const data = await getDataPromisified('splitComponents')
      await splitComponentRegistry.loadComponents(data)

      // In case the root element doesn't exist, let's create it
      if (!rootElement) {
        rootElement = document.createElement(rootElementType);
        rootElement.id = rootElementName;

        // check if a 2-dimensional array was passed... if not, be nice and handle it anyway
        if (attributes[0] instanceof Array) {
          // set attributes
          for (let i = 0; i < attributes.length; i++) {
            rootElement.setAttribute(attributes[i][0], attributes[i][1]);
          }
        } else if (attributes.length > 0) {
          rootElement.setAttribute(attributes[0], attributes[1]);
        }

        document.body.appendChild(rootElement);
      }
      
      let serverUrl = await getDataPromisified('url');
      if (serverUrl && serverUrl !== window.location.pathname+(window.location.search||"")) {
        //throw new Error(`RouterClient sees a URL mismatch: ${serverUrl} vs ${window.location.pathname}`);
        Sentry.captureException(new Error(`RouterClient sees a URL mismatch: ${serverUrl} vs ${window.location.pathname}`));
      }

      // Rehydrate data client side, if desired.
      if (typeof options.rehydrateHook === 'function') {
        InjectData.getData('dehydrated-initial-data', (data) => {
          const rehydratedData = data ? JSON.parse(data) : undefined;
          options.rehydrateHook(rehydratedData);
        });
      }

      let history = browserHistory;

      if (typeof options.historyHook === 'function') {
        history = options.historyHook(history);
      }

      const appGenerator = addProps => (
        <Router
          history={history}
          {...options.props}
          {...addProps}
        >
          {routes}
        </Router>
      );

      let app;
      if (typeof options.wrapperHook === 'function') {
        app = options.wrapperHook(appGenerator);
      }

      if (typeof options.renderHook === 'function') {
        options.renderHook(app, rootElement);
      } else {
        ReactDOM.hydrate(app, rootElement);
      }

      const collectorEl = document.getElementById(options.styleCollectorId || 'css-style-collector-data');

      if (collectorEl) {
        collectorEl.parentNode.removeChild(collectorEl);
      }
    });
  },
};
