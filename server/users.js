Accounts.onCreateUser(function(options, user){
  _.extend(user, options);
  
  user.karma = 0;
  user.profile = user.profile || {};
  
  // users start pending, need to be invited
  user.isInvited = false
  
  if (options.email)
    user.profile.email = options.email;
    
  if (user.profile.email)
    user.email_hash = CryptoJS.MD5(user.profile.email.trim().toLowerCase()).toString();
  
  if (!user.profile.name)
    user.profile.name = user.username;
  
  return user;
});

// FIXME -- don't use this yet, until a) we are sure it's the right approach
// b) we also update their profile at the same time.
Meteor.methods({
  changeEmail: function(newEmail) {
    Meteor.users.update(Meteor.userId(), {$set: {emails: [{address: newEmail}]}});
  }
});