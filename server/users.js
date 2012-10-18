Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};
  user.karma = 0;
  
  // users start pending, need to be invited
  user.isInvited = false
  
  if (options.email)
    user.profile.email = options.email;
    
  if (user.profile.email)
    user.email_hash = CryptoJS.MD5(user.profile.email.trim().toLowerCase()).toString();
  
  if (!user.profile.name)
    user.profile.name = user.username;
  
  console.log('### user', user)

  return user;
});

// FIXME -- don't use this yet, until a) we are sure it's the right approach
// b) we also update their profile at the same time.
Meteor.methods({
  changeEmail: function(newEmail) {
    Meteor.users.update(Meteor.userId(), {$set: {emails: [{address: newEmail}]}});
  }
});