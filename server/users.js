Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};
  user.karma = 0;
  
  // users start pending and need to be invited
  user.isInvited = false
  
  if (options.email)
    user.profile.email = options.email;
    
  if (user.profile.email)
    user.email_hash = CryptoJS.MD5(user.profile.email.trim().toLowerCase()).toString();
  
  if (!user.profile.name)
    user.profile.name = user.username;
  
  // if this is the first user ever, make them an admin
  if ( !Meteor.users.find().count() )
    user.isAdmin = true;

  trackEvent('new user', {username: user.username, email: user.profile.email});

  return user;
});

// FIXME -- don't use this yet, until a) we are sure it's the right approach
// b) we also update their profile at the same time.
Meteor.methods({
  changeEmail: function(newEmail) {
    Meteor.users.update(Meteor.userId(), {$set: {emails: [{address: newEmail}]}});
  },
  numberOfPostsToday: function(){
    console.log(numberOfItemsInPast24Hours(Meteor.user(), Posts));
  },
  numberOfCommentsToday: function(){
    console.log(numberOfItemsInPast24Hours(Meteor.user(), Comments));
  },
  testEmail: function(){
    console.log('////////////////email test…');
    Email.send({from: 'info@sachagreif.com', to: 'sacha357@gmail.com', subject: 'mailgun test', text: 'lorem ipsum dolor'});
  },
  testBuffer: function(){
    // TODO
  }
});

// permissions for the profiler
Meteor.Profiler.allow = function(userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.isAdmin;
};

