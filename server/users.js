// getFriendsFacebookIds = function (user) {
//   return _.pluck(HTTP.get('https://graph.facebook.com/v2.2/' + user.services.facebook.id + '/friends', {
//     params: {access_token: user.services.facebook.accessToken, limit: 1000}
//   }).data.data, 'id').concat(user.services.facebook.id);
// }

var checkFcebookFriends = function(user) {
    var userId = user._id,
      facebook = user.services.facebook,
      facebookId = facebook.id,
      facebookName = facebook.name,
      facebookFriendsIds = _.unique(_.pluck(HTTP.get('https://graph.facebook.com/v2.2/' + facebookId + '/friends', {
                          params: {access_token: facebook.accessToken, limit: 1000}
                          }).data.data, 'id'));

  console.log(facebookId+'==='+facebookName+'==='+facebookFriendsIds+'==='+userId );

  var friendsIds =  _.pluck(Meteor.users.find({'services.facebook.id': {$in: facebookFriendsIds}}, 
                                                  {fields: {'_id': 1}}).fetch(), '_id');

  console.log(friendsIds);

  user.services.facebook.friendsIds = facebookFriendsIds;
  user.services.facebook.updatedAt = new Date();
  user.friendsIds = friendsIds;

  for (var i=0; i<friendsIds.length; i++) {
    Meteor.users.update({_id: friendsIds[i]},{
      $addToSet: {friendsIds:userId, 'services.facebook.friendsIds':facebookId}
    });
  }
}

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
  if (!user.profile.name)
    user.profile.name = user.username;

  // create slug from username
  user.slug = slugify(getUserName(user));

  // if this is not a dummy account, and is the first user ever, make them an admin
  user.isAdmin = (!user.profile.isDummy && Meteor.users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit client callbacks on properties object successively
  clog('// Start userCreatedCallbacks')
  user = userCreatedCallbacks.reduce(function(result, currentFunction) {
    clog('// Running '+currentFunction.name+'…')
    return currentFunction(result);
  }, user);
  clog('// Finished userCreatedCallbacks')
  clog('// User object:')
  clog(user)

  // ------------------------------ Analytics ------------------------------ //

  trackEvent('new user', {username: user.username, email: user.profile.email});

  // ------------------------------ Insert friends ------------------------------ //
  if (!!user && !!user.services.facebook) {
    checkFcebookFriends(user);
    console.log("on create user facebook friends checked");
  }

  return user;
});


Accounts.onLogin(function(result){
  // ------------------------------ Insert friends ------------------------------ //
  var user = result.user;

  if (!!user && !!user.services.facebook) {
    checkFcebookFriends(user);
    console.log("facebook login friends checked");
  }
  return user;
});

Meteor.methods({
  changeEmail: function (newEmail) {
    Meteor.users.update(
      Meteor.userId(),
      {$set: {
          emails: [{address: newEmail}],
          email_hash: Gravatar.hash(newEmail),
          // Just in case this gets called from somewhere other than /client/views/users/user_edit.js
          "profile.email": newEmail
        }
      }
    );
  },
  numberOfPostsToday: function(){
    console.log(numberOfItemsInPast24Hours(Meteor.user(), Posts));
  },
  numberOfCommentsToday: function(){
    console.log(numberOfItemsInPast24Hours(Meteor.user(), Comments));
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
  // Not in use
  updateFriendsListL: function(facebookFriendsIds) {
    var friendsIds =  Meteor.users.find({'services.facebook.id': {$in: facebookFriendsIds}}, {fields: '_id', multi: true});
    console.log(friendsIds);
  }

});
