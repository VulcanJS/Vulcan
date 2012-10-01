Meteor.accounts.onCreateUser(function(options, extra, user){
  user.karma = 0;
  if (options.email)
    user.email_hash = CryptoJS.MD5(options.email.trim().toLowerCase()).toString();
  
  _.extend(user, extra)
  
  return user;
});