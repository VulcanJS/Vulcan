/**
 * The App + relevant wrappers
 */
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { runCallbacks } from '../../modules';

import { Components } from 'meteor/vulcan:lib';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { useEffect } from 'react';

// @see packages/vulcan-ui-material/lib/components/stylesManager/JssMover.jsx
// FIXME: this is a temporary hack
const JssMoverRoute = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    history.listen(() => {
      console.warn('Moving JSS styles on route change');
      const elements = document.querySelectorAll('[data-jss][data-meta^=Mui],[data-jss][data-meta=ForwardRef]');
      if (elements.length) {
        document.head.prepend(...elements);
      }
      // also update 100ms after in case they were loading
      setTimeout(() => {
        console.warn('Moving JSS styles on route change (delayed)');
        const elements = document.querySelectorAll('[data-jss][data-meta^=Mui],[data-jss][data-meta=ForwardRef]');

        if (elements.length) {
          document.head.prepend(...elements);
        }
      }, 300);
    });
  }, []);
  return children;
};
const AppGenerator = ({ apolloClient }) => {
  const App = (
    <ApolloProvider client={apolloClient}>
      <CookiesProvider>
        <BrowserRouter>
          <JssMoverRoute>
            <Components.App />
          </JssMoverRoute>
        </BrowserRouter>
      </CookiesProvider>
    </ApolloProvider>
  );
  // run user registered callbacks to wrap the app
  const WrappedApp = runCallbacks({
    name: 'router.client.wrapper',
    iterator: App,
    properties: { apolloClient },
  });
  return WrappedApp;
};
export default AppGenerator;
