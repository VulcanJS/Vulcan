import Users from '../collection.js';
import { runCallbacks, runCallbacksAsync } from 'meteor/nova:lib'; // import from nova:lib because nova:core isn't loaded yet

function novaCreateUserCallbacks (options, user) {
  user = runCallbacks("users.new.sync", user, options);

  runCallbacksAsync("users.new.async", user);

  // check if all required fields have been filled in. If so, run profile completion callbacks
  if (Users.hasCompletedProfile(user)) {
    runCallbacksAsync("users.profileCompleted.async", user);
  }

  return user;
}

Accounts.onCreateUser(novaCreateUserCallbacks);