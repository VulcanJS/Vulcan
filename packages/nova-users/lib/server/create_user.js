import Telescope from 'meteor/nova:lib';

function telescopeCreateUserCallback (options, user) {
  user = Telescope.callbacks.run("onCreateUser", user, options);
  return user;
};

Accounts.onCreateUser(telescopeCreateUserCallback);