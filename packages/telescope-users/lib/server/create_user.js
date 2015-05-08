Accounts.onCreateUser(function(options, user){
  user = Telescope.callbacks.run("onCreateUser", user, options);
  return user;
});