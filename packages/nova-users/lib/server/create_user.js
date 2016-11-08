import Telescope from 'meteor/nova:lib';

function novaCreateUserCallback (options, user) {
  user = Telescope.callbacks.run("users.new.sync", user, options);
  return user;
};

Accounts.onCreateUser(novaCreateUserCallback);