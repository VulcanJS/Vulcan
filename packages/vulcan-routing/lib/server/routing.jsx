import React from 'react';
import Helmet from 'react-helmet';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
// import styleSheet from 'styled-components/lib/models/StyleSheet';

import { Meteor } from 'meteor/meteor';

import {
  Components,
  addRoute,
  Routes, populateComponentsApp, populateRoutesApp,
  getRenderContext,
} from 'meteor/vulcan:lib';

import { RouterServer } from './router.jsx';

Meteor.startup(() => {
  // note: route defined here because it "shouldn't be removable"
  addRoute({name:"app.notfound", path:"*", componentName: 'Error404'});

  // init the application components and routes, including components & routes from 3rd-party packages
  populateComponentsApp();
  populateRoutesApp();

  const indexRoute = _.filter(Routes, route => route.path === '/')[0];
  const childRoutes = _.reject(Routes, route => route.path === '/');

  if (indexRoute) {
    delete indexRoute.path; // delete the '/' path to avoid warning
  }

  const AppRoutes = {
    path: '/',
    component: Components.App,
    indexRoute,
    childRoutes,
  };

  const options = {
    historyHook(req, res, newHistory) {
      const { history } = getRenderContext();
      return history;
    },
    wrapperHook(req, res, appGenerator) {
      const { apolloClient, store } = getRenderContext();
      store.reload();
      store.dispatch({ type: '@@nova/INIT' }) // the first dispatch will generate a newDispatch function from middleware
      const app = appGenerator();
      return <ApolloProvider store={store} client={apolloClient}>{app}</ApolloProvider>;
    },
    preRender(req, res, app) {
      return Promise.await(getDataFromTree(app));
    },
    dehydrateHook(req, res) {
      const context = getRenderContext();
      return context.apolloClient.store.getState();
    },
    postRender(req, res) {
      // req.css = styleSheet.sheet ? styleSheet.rules().map(rule => rule.cssText).join('\n') : '';
      // const context = renderContext.get();
      // context.css = req.css;
    },
    htmlHook(req, res, dynamicHead, dynamicBody) {
      const head = Helmet.rewind();
      return {
        dynamicHead: `${head.title}${head.meta}${head.link}${head.script}${dynamicHead}`,
        dynamicBody,
      };
    },
  };

  RouterServer.run(AppRoutes, options);
});
