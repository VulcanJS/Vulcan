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
  	if (!user.services.facebook || !user.services.facebook.friendsIds || !this.facebookVoters) {
  		return false;
  	}
  	return _.intersection(user.services.facebook.friendsIds, this.facebookVoters).length;
  },
  friends: function (data) {
    if (data > 1) {
      return "friends";
    }
    return "friend";
  }
});
