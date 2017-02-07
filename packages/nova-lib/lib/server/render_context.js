import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { DDP } from 'meteor/ddp';
import { Accounts } from 'meteor/accounts-base';

import { createApolloClient, getReducers, getMiddlewares } from '../modules/index.js';
import { configureStore } from './store.js';

const Fibers = Npm.require('fibers');

export const renderContext = new Meteor.EnvironmentVariable();

const Context = function Context(loginToken) {
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

WebApp.connectHandlers.use(Meteor.bindEnvironment((req, res, next) => {
  req.loginToken = req.cookies && req.cookies.meteor_login_token;
  req.apolloClient = createApolloClient({ currentUserToken: req.loginToken });
  req.reducers = { ...getReducers(), apollo: req.apolloClient.reducer() };
  req.middlewares = [...getMiddlewares(), req.apolloClient.middleware()];
  req.store = configureStore(req.reducers, {}, req.middlewares);

  renderContext.withValue({
    loginToken: req.loginToken,
    apolloClient: req.apolloClient,
    reducers: req.reducers,
    middlewares: req.middlewares,
    store: req.store,
  }, () => {
    // support for Meteor.user
    Fibers.current._meteor_dynamics[DDP._CurrentInvocation.slot] = new Context(req.loginToken);

    next();
  });
}));
