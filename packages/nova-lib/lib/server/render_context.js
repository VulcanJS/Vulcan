import { createMemoryHistory } from 'react-router';

import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp';
import { Accounts } from 'meteor/accounts-base';
import { RoutePolicy } from 'meteor/routepolicy';

import { createApolloClient, getReducers, getMiddlewares } from '../modules/index.js';
import { configureStore } from './store.js';

const Fiber = Npm.require('fibers');

export const renderContext = new Meteor.EnvironmentVariable();

export const getRenderContext = () => renderContext.get();

function isAppUrl(req) {
  const url = req.url;
  if (url === '/favicon.ico' || url === '/robots.txt') {
    return false;
  }

  if (url === '/app.manifest') {
    return false;
  }

  // Avoid serving app HTML for declared routes such as /sockjs/.
  if (RoutePolicy.classify(url)) {
    return false;
  }

  // we only need to support HTML pages only
  // this is a check to do it
  return /html/.test(req.headers.accept);
}

const LoginContext = function LoginContext(loginToken) {
  this._loginToken = loginToken;

  // get the user
  if (Meteor.users) {
    // check to make sure, we've the loginToken,
    // otherwise a random user will fetched from the db
    let user;
    if (loginToken) {
      const hashedToken = loginToken && Accounts._hashLoginToken(loginToken);
      const query = { 'services.resume.loginTokens.hashedToken': hashedToken };
      const options = { fields: { _id: 1 } };
      user = Meteor.users.findOne(query, options);
    }

    if (user) {
      this.userId = user._id;
    }
  }
};

export const withRenderContextRaw = (func, options = {}) => {
  const newFunc = Meteor.bindEnvironment((req, res, next) => {
    Fiber.current._meteor_dynamics = Fiber.current._meteor_dynamics || [];
    Fiber.current._meteor_dynamics[DDP._CurrentInvocation.slot] = req.loginContext;
    Fiber.current._meteor_dynamics[renderContext.slot] = req.renderContext;

    func(req, res, next);

    if (options.autoNext) {
      next();
    }
  })

  if (options.name) {
    Object.defineProperty(newFunc, 'name', { value: options.name });
  }
  WebApp.connectHandlers.use(newFunc);
}

export const withRenderContext = (func) => {
  withRenderContextRaw(func, { autoNext: true });
};

WebApp.connectHandlers.use(Meteor.bindEnvironment((req, res, next) => {
  if (!isAppUrl(req)) {
    next();
    return;
  }

  req.history = createMemoryHistory(req.url);
  req.loginToken = req.cookies && req.cookies.meteor_login_token;
  req.apolloClient = createApolloClient({ currentUserToken: req.loginToken });
  req.reducers = { ...getReducers(), apollo: req.apolloClient.reducer() };
  req.middlewares = [...getMiddlewares(), req.apolloClient.middleware()];
  req.store = configureStore(req.reducers, {}, req.middlewares);
  req.loginContext = new LoginContext(req.loginToken);
  req.renderContext = {
    history: req.history,
    loginToken: req.loginToken,
    apolloClient: req.apolloClient,
    reducers: req.reducers,
    middlewares: req.middlewares,
    store: req.store,
  };
  next();
}));
