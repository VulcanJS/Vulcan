Accounts.onCreateUser(function(options, user){

  // ------------------------------ Properties ------------------------------ //

  var userProperties = {
    profile: options.profile || {},
    karma: 0,
    isInvited: false,
    postCount: 0,
    commentCount: 0,
    invitedCount: 0,
    votes: {
      upvotedPosts: [],
      downvotedPosts: [],
      upvotedComments: [],
      downvotedComments: []
    }
  };
  user = _.extend(user, userProperties);

  // set email on profile
  if (options.email)
    user.profile.email = options.email;

  // if email is set, use it to generate email hash
  if (getEmail(user))
    user.email_hash = getEmailHash(user);

  // set username on profile
  if (!user.profile.username)
    user.profile.username = user.username;

  // create slug from username
  user.slug = slugify(getUserName(user));

  // if this is not a dummy account, and is the first user ever, make them an admin
  user.isAdmin = (!user.profile.isDummy && Meteor.users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit client callbacks on properties object successively
  clog('// Start userCreatedCallbacks');
  user = userCreatedCallbacks.reduce(function(result, currentFunction) {
    clog('// Running '+currentFunction.name+'…');
    return currentFunction(result);
  }, user);
  clog('// Finished userCreatedCallbacks');
  // clog('// User object:');
  // clog(user);

  // ------------------------------ Analytics ------------------------------ //

  trackEvent('new user', {username: user.username, email: user.profile.email});

  return user;
});


Meteor.methods({
  changeEmail: function (userId, newEmail) {
    var user = Meteor.users.findOne(userId);
    if (can.edit(Meteor.user(), user) !== true) {
      throw new Meteor.Error("Permission denied");
    }
    Meteor.users.update(
      userId,
      {$set: {
          emails: [{address: newEmail, verified: false}],
          email_hash: Gravatar.hash(newEmail),
          // Just in case this gets called from somewhere other than /client/views/users/user_edit.js
          "profile.email": newEmail
        }
      }
    );
  },
  // numberOfPostsToday: function(){
  //   console.log(numberOfItemsInPast24Hours(Meteor.user(), Posts));
  // },
  // numberOfCommentsToday: function(){
  //   console.log(numberOfItemsInPast24Hours(Meteor.user(), Comments));
  // },
  testBuffer: function(){
    // TODO
  },
  getScoreDiff: function(id){
    var object = Posts.findOne(id);
    var baseScore = object.baseScore;
    var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);
    var newScore = baseScore / Math.pow(ageInHours + 2, 1.3);
    return Math.abs(object.score - newScore);
  }
});
