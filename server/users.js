Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};
  user.profile.karma = 0;
  user.profile.notificationsFrequency = 1;
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
    Email.send({from: 'test@test.com', to: getEmail(Meteor.user()), subject: 'Telescope email test', text: 'lorem ipsum dolor sit amet.'});
  },
  testBuffer: function(){
    // TODO
  },
  getScoreDiff: function(id){
    var object = Posts.findOne(id);
    var baseScore = object.baseScore;
    var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);
    var newScore = baseScore / Math.pow(ageInHours + 2, 1.3);
    return Math.abs(object.score - newScore);
  },
  generateEmailHash: function(){
    var email_hash = CryptoJS.MD5(getEmail(Meteor.user()).trim().toLowerCase()).toString();
    Meteor.users.update(Meteor.userId(), {$set : {email_hash : email_hash}});
  }
});

// permissions for the profiler
Meteor.Profiler.allow = function(userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.isAdmin;
};

