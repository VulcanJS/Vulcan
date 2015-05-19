Accounts.onCreateUser(function(options, user){
  
  user = Telescope.callbacks.run("onCreateUser", user, options);

  Telescope.callbacks.runAsync("onCreateUserAsync", user, options);

  return user;
});