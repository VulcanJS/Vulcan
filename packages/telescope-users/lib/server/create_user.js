Accounts.onCreateUser(function(options, user){
  user = Telescope.callbacks.run("userCreated", user, options);
  return user;
});