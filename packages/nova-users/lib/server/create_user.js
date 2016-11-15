import Telescope from 'meteor/nova:lib';
import Users from '../collection.js';

function novaCreateUserCallbacks (options, user) {
  user = Telescope.callbacks.run("users.new.sync", user, options);

  Telescope.callbacks.runAsync("users.new.async", user);

  // check if all required fields have been filled in. If so, run profile completion callbacks
  if (Users.hasCompletedProfile(user)) {
    Telescope.callbacks.runAsync("users.profileCompleted.async", user);
  }

  return user;
}

Accounts.onCreateUser(novaCreateUserCallbacks);