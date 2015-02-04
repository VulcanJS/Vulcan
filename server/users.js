// getFriendsFacebookIds = function (user) {
//   return _.pluck(HTTP.get('https://graph.facebook.com/v2.2/' + user.services.facebook.id + '/friends', {
//     params: {access_token: user.services.facebook.accessToken, limit: 1000}
//   }).data.data, 'id').concat(user.services.facebook.id);
// }

var checkFcebookFriends = function(user) {
  if (typeof user._id === "undefined" || typeof user.services.facebook === "undefined") {
    return;
  }

  var userId = user._id,
    facebook = user.services.facebook,
    facebookId = facebook.id,
    facebookName = facebook.name,
    appsecret_proof = 
    facebookFriendsIds = _.unique(_.pluck(HTTP.get('https://graph.facebook.com/v2.2/' + facebookId + '/friends', {
                        params: {access_token: facebook.accessToken, limit: 1000}
                        }).data.data, 'id'));

  if (typeof facebookFriendsIds == 'undefined') {
    return;
  }

  var friendsIds =  _.pluck(Meteor.users.find({'services.facebook.id': {$in: facebookFriendsIds}}, 
                                                  {fields: {'_id': 1}}).fetch(), '_id');

  console.log('===>facebookId: '+facebookId+' ===>facebookName: '+facebookName+' ===>facebookFriendsIds: '+facebookFriendsIds+' ===>userId: '+userId );

  if (typeof friendsIds !== "undefined") {
    user.services.facebook.friendsIds = facebookFriendsIds;
    user.services.facebook.updatedAt = new Date();
    user.friendsIds = friendsIds;

    for (var i=0; i<friendsIds.length; i++) {
      Meteor.users.update({_id: friendsIds[i]},{
        $addToSet: {friendsIds:userId, 'services.facebook.friendsIds':facebookId}
      });
    }

  }
};

var friendsWonders = function (user) {
  user = typeof user === "undefined" ? Meteor.user() : user;

  if (typeof user.friendsIds === "undefined" || typeof user.votes.pollvotedPosts === "undefined") {
    return;
  }

  var friends = user.friendsIds,
      userPollVotes = user.votes.pollvotedPosts,
      userUpvotes = user.votes.upvotedPosts,
      userPollItemIds = _.pluck(userPollVotes, 'itemId'),
      userUpvotesItemIds = _.pluck(userUpvotes, 'itemId'),
      userVotes = _.union(userPollItemIds, userUpvotesItemIds),
      friendsWonders = [];

  for (var i=0, fl=friends.length; i<fl; i++) {

    var friendId = friends[i],
        friend = Meteor.users.findOne(friendId);

    if (typeof friend === "undefined") {
      Meteor.users.update({_id:user._id},{$pull:{friendIds:friendId}});
      continue;
    }
    if (typeof friend.votes.pollvotedPosts === "undefined") {
      continue;
    }

    var friendPollVotes = friend.votes.pollvotedPosts,
        friendUpvotes = friend.votes.upvotedPosts,
        together = userPollVotes.concat(friendPollVotes),
        friendPollItemIds = _.pluck(friendPollVotes, 'itemId'),
        friendUpvotesItemIds = _.pluck(friendUpvotes, 'itemId'),
        sameIds = _.intersection(userPollItemIds, friendPollItemIds),
        friendVotes = _.union(friendPollItemIds, friendUpvotesItemIds),
        togetherIds = userVotes.concat(friendVotes),
        togetherUniqLength = _.uniq(togetherIds).length,
        sameVotes = [];

    if (!_.isUndefined(friendPollVotes)) {
      var wonderCount = Math.round( ( 1- ( ( togetherUniqLength  - friendVotes.length ) / togetherUniqLength ) ) * 100 );
    } else {
      var wonderCount = 0;
    }

    for (var j=0, tl=together.length; j<tl; j++) {
      if ( _.contains(sameIds,together[j].itemId) && !_.isUndefined(together[j].voteOrder) ) {
        sameVotes.push(together[j].itemId+"-"+together[j].voteOrder);
      }
    } 

    if (!_.isEmpty(sameVotes)) {
      var sharedOpinionCount = Math.round( ( (sameVotes.length - _.uniq(sameVotes).length) / sameIds.length ) * 100 );
    } else {
      var sharedOpinionCount = 0;
    }

    var friendWonders = {friendId: friendId,
                          friendName: friend.services.facebook.name,
                          wonderCount: wonderCount,
                          sharedOpinionCount: sharedOpinionCount};

    friendsWonders.push(friendWonders);

  }

  Meteor.users.update({_id: user._id}, {
    $set: {friendsWonders: friendsWonders}
  });
};

Accounts.onCreateUser(function(options, user){

  // ------------------------------ Properties ------------------------------ //

  var userProperties = {
    profile: options.profile || {},
    karma: 0,
    postCount: 0,
    commentCount: 0,
    invitedCount: 0,
    votes: {
      upvotedPosts: [],
      downvotedPosts: [],
      upvotedComments: [],
      downvotedComments: []
    },
    friendsIds:[],
    friendsWonders : []
  };
  user = _.extend(user, userProperties);

  if(!!options.services && !!options.services.facebook) {
    user.isInvited = false;
  } else {
    user.isInvited = true;
  }

  // set email on profile
  if (options.email) {
    user.profile.email = options.email;
  } else if(options && options.services && options.services.facebook && options.services.facebook.email) {
    user.profile.email = options.services.facebook.email;
  }
    
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

  return user;
});

Accounts.onLogin(function(result){
  // ------------------------------ Insert friends ------------------------------ //
  var user = result.user;
  if (!!user && !!user.services.facebook) {
    checkFcebookFriends(user);
    console.log("facebook login friends checked: " + user.friendsIds);
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
  updateFriendsListL: function(user) {
    checkFcebookFriends(user);
    console.log('updateFriendsListL called');
  },
  updateFriendsWonders: function (user) {
    checkFcebookFriends(user);
    friendsWonders(user);
    console.log('updateFriendsListL called');
  }

});
