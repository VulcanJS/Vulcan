import React from 'react';
import Helmet from 'react-helmet';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
import { CookiesProvider } from 'react-cookie';
import { Meteor } from 'meteor/meteor';

import {
  Components,
  addRoute,
  Routes, populateComponentsApp, populateRoutesApp, initializeFragments,
  getRenderContext,
  runCallbacks,
  getHeaderLocale,
} from 'meteor/vulcan:lib';

import { RouterServer } from './router.jsx';

Meteor.startup(() => {
  // note: route defined here because it "shouldn't be removable"
  addRoute({name:'app.notfound', path:'*', componentName: 'Error404'});

  // init the application components and routes, including components & routes from 3rd-party packages
  initializeFragments();
  populateComponentsApp();
  populateRoutesApp();
  
  const indexRoute = _.filter(Routes, route => route.path === '/')[0];
  const childRoutes = _.reject(Routes, route => route.path === '/');

  const indexRouteWithoutPath = _.clone(indexRoute);

  if (indexRouteWithoutPath) {
    delete indexRouteWithoutPath.path; // delete path to avoid warning
  }

  const AppRoutes = {
    path: '/',
    component: Components.App,
    indexRoute: indexRouteWithoutPath,
    childRoutes,
  };

  const options = {
    historyHook(req, res, newHistory) {
      let { history } = getRenderContext();
      history = runCallbacks('router.server.history', history, { req, res, newHistory });
      return history;
    },
    wrapperHook(req, res, appGenerator) {
      const { apolloClient, store } = getRenderContext();
      store.reload();
      store.dispatch({ type: '@@nova/INIT' }) // the first dispatch will generate a newDispatch function from middleware
      const app = runCallbacks('router.server.wrapper', appGenerator(), { req, res, store, apolloClient });
      const locale = getHeaderLocale(req.headers );
      const appWithLocale = React.cloneElement(app, { locale });
      // TODO: currently locale is passed through cookies as a hack because it's not available as props; fix this
      req.universalCookies.cookies.locale = locale;
      return <ApolloProvider store={store} client={apolloClient}><CookiesProvider cookies={req.universalCookies}>{appWithLocale}</CookiesProvider></ApolloProvider>;
    },
    preRender(req, res, app) {
      runCallbacks('router.server.preRender', { req, res, app });
      return Promise.await(getDataFromTree(app));
    },
    dehydrateHook(req, res) {
      const context = runCallbacks('router.server.dehydrate', getRenderContext(), { req, res });
      return context.apolloClient.store.getState();
    },
    postRender(req, res) {
      runCallbacks('router.server.postRender', { req, res });
    },
    htmlHook(req, res, dynamicHead, dynamicBody) {
      const head = runCallbacks('router.server.html', Helmet.rewind(), { req, res, dynamicHead, dynamicBody });
      return {
        dynamicHead: `${head.title}${head.meta}${head.link}${head.script}${dynamicHead}`,
        dynamicBody,
      };
    },
  };

  RouterServer.run(AppRoutes, options);
});
