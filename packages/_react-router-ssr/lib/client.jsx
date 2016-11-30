import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

const ReactRouterSSR = {
  Run(routes, clientOptions) {
    if (!clientOptions) {
      clientOptions = {};
    }

    let history = browserHistory;

    if(typeof clientOptions.historyHook === 'function') {
      history = clientOptions.historyHook(history);
    }

    Meteor.startup(function() {
      const rootElementName = clientOptions.rootElement || 'react-app';
      const rootElementType = clientOptions.rootElementType || 'div';
      const attributes = clientOptions.rootElementAttributes instanceof Array ? clientOptions.rootElementAttributes : [];
      let rootElement = document.getElementById(rootElementName);

      // In case the root element doesn't exist, let's create it
      if (!rootElement) {
        rootElement = document.createElement(rootElementType);
        rootElement.id = rootElementName;

        // check if a 2-dimensional array was passed... if not, be nice and handle it anyway
        if(attributes[0] instanceof Array) {
          // set attributes
          for(var i = 0; i < attributes.length; i++) {
            rootElement.setAttribute(attributes[i][0], attributes[i][1]);
          }
        } else if (attributes.length > 0){
          rootElement.setAttribute(attributes[0], attributes[1]);
        }

        document.body.appendChild(rootElement);
      }

      // Rehydrate data client side, if desired.
      if(typeof clientOptions.rehydrateHook === 'function') {
        InjectData.getData('dehydrated-initial-data', data => {
          const rehydratedData = data ? JSON.parse(data) : undefined;
          clientOptions.rehydrateHook(rehydratedData);
        });
      }

      let app = (
        <Router
          history={history}
          children={routes}
          {...clientOptions.props} />
      );

      if (typeof clientOptions.wrapperHook === 'function') {
        app = clientOptions.wrapperHook(app);
      }

      if (typeof clientOptions.renderHook === 'function') {
        clientOptions.renderHook(app, rootElement);
      } else {
        ReactDOM.render(app, rootElement);
      }

      let collectorEl = document.getElementById(clientOptions.styleCollectorId || 'css-style-collector-data')

      if (collectorEl) {
        collectorEl.parentNode.removeChild(collectorEl);
      }
    });
  }
};

export { ReactRouterSSR };
export default ReactRouterSSR;
