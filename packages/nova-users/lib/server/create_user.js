import Telescope from 'meteor/nova:lib';
import Users from '../collection.js';
import { Callbacks } from 'meteor/nova:lib'; // import from nova:lib because nova:core isn't loaded yet

function novaCreateUserCallbacks (options, user) {
  user = Callbacks.run("users.new.sync", user, options);

  Callbacks.runAsync("users.new.async", user);

  // check if all required fields have been filled in. If so, run profile completion callbacks
  if (Users.hasCompletedProfile(user)) {
    Callbacks.runAsync("users.profileCompleted.async", user);
  }

  return user;
}

Accounts.onCreateUser(novaCreateUserCallbacks);