import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp';
import { Accounts } from 'meteor/accounts-base';

import { createApolloClient, getReducers, getMiddlewares } from '../modules/index.js';
import { configureStore } from './store.js';

const Fiber = Npm.require('fibers');

export const renderContext = new Meteor.EnvironmentVariable();

export const getRenderContext = () => renderContext.get();

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

export const ssr = (func, options = {}) => {
  const newFunc = Meteor.bindEnvironment((req, res, next) => {
    req.loginToken = req.loginToken || (req.cookies && req.cookies.meteor_login_token);
    req.apolloClient = req.apolloClient || createApolloClient({ currentUserToken: req.loginToken });
    req.reducers = req.reducers || { ...getReducers(), apollo: req.apolloClient.reducer() };
    req.middlewares = req.middlewares || [...getMiddlewares(), req.apolloClient.middleware()];
    req.store = req.store || configureStore(req.reducers, {}, req.middlewares);
    req.loginContext = req.loginContext || new LoginContext(req.loginToken);
    req.renderContext = req.renderContext || {
      loginToken: req.loginToken,
      apolloClient: req.apolloClient,
      reducers: req.reducers,
      middlewares: req.middlewares,
      store: req.store,
    };

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

export const ssrNext = (func) => {
  ssr(func, { autoNext: true });
}

ssr((req, res, next) => {
  // initialize
  // console.log(Fiber.current)
  next();
});
