Accounts.onCreateUser(function(options, user){
  var userProperties = {
    profile: options.profile || {},
    karma: 0,
    isInvited: false,
    isAdmin: false,
    postCount: 0,
    commentCount: 0,
    invitedCount: 0
  }
  user = _.extend(user, userProperties);

  if (options.email)
    user.profile.email = options.email;
    
  if (user.profile.email)
    user.email_hash = CryptoJS.MD5(user.profile.email.trim().toLowerCase()).toString();
  
  if (!user.profile.name)
    user.profile.name = user.username;
  
  // create slug from username
  user.slug = slugify(getUserName(user));

  // if this is the first user ever, make them an admin
  if (!Meteor.users.find().count() )
    user.isAdmin = true;

  // give new users a few invites (default to 3)
  user.inviteCount = getSetting('startInvitesCount', 3);

  trackEvent('new user', {username: user.username, email: user.profile.email});

  // if user has already filled in their email, add them to MailChimp list
  if(user.profile.email)
    addToMailChimpList(user);

  return user;
});

addToMailChimpList = function(user){
  // add a user to a MailChimp list.
  // called when a new user is created, or when an existing user fills in their email
  if((MAILCHIMP_API_KEY=getSetting('mailChimpAPIKey')) && (MAILCHIMP_LIST_ID=getSetting('mailChimpListId'))){

    var email = getEmail(user);
    if (! email)
      throw 'User must have an email address';

    console.log('adding "'+email+'" to MailChimp list…');
    
    var mailChimp = new MailChimpAPI(MAILCHIMP_API_KEY, { version : '1.3', secure : false });
    
    mailChimp.listSubscribe({
      id: MAILCHIMP_LIST_ID,
      email_address: email,
      double_optin: false
    });
  }
}

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
  },
  addCurrentUserToMailChimpList: function(){
    addToMailChimpList(Meteor.user());
  }
});