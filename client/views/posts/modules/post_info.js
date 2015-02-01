Template[getTemplate('postInfo')].helpers({
  pointsUnitDisplayText: function(){
    return this.upvotes == 1 ? i18n.t('point') : i18n.t('points');
  },
  getTemplate: function() {
    return getTemplate("postAuthor");
  },
  hasVote: function () {
  	return this.poll && this.poll.voteCount > 1;
  },
  friendsVotes: function () {
    var user = Meteor.user();
    var friendsVotesCount = _.intersection(user.services.facebook.friendsIds, this.facebookVoters).length
    if (friendsVotesCount <= 2) {
      return;
    }
  	return friendsVotesCount - 2; 
  },
  friendsNames: function(data) {
    var user = Meteor.user();
    if (!user || _.isUndefined(user.services)) {
      return false;
    }
    if (!user.services.facebook || !user.services.facebook.friendsIds || !this.facebookVoters) {
      return false;
    }

    var friendsIds = _.intersection(user.services.facebook.friendsIds, this.facebookVoters),
        upvoters = data.upvoters,
        friendsNames = user.friendsWonders,
        friendsNamesLength = user.friendsWonders.length,
        friendsFacebookNames = [];

    for (var i=0; i<friendsNamesLength; i++) {
      if(_.indexOf(upvoters, friendsNames[i].friendId)) {
        var friendName = _.first(friendsNames[i].friendName.split(" "), 1);
        friendsFacebookNames.push({friendName:friendName, friendId: friendsNames[i].friendId});
      }
      if (friendsFacebookNames.length > 2) {
        break;
      }
    }
    // need more work on this
    return _.first(friendsFacebookNames, 2);
  },
  friends: function (data) {
    if (data > 1) {
      return "friends";
    }
    return "friend";
  }
});
