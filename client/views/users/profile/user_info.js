Template[getTemplate('userInfo')].helpers({
  canEditProfile: function() {
    var currentUser = Meteor.user();
    return currentUser && (this._id == currentUser._id || isAdmin(currentUser));
  },
  createdAtFormatted: function() {
    return this.createdAt;
  },
  canInvite: function() {
    // if the user is logged in, the target user hasn't been invited yet, invites are enabled, and user is not viewing their own profile
    return Meteor.user() && Meteor.user()._id != this._id && !isInvited(this) && invitesEnabled() && can.invite(Meteor.user());
  },
  inviteCount: function() {
    return Meteor.user().inviteCount;
  },
  getTwitterName: function () {
    return getTwitterName(this);
  },
  getGitHubName: function () {
    return getGitHubName(this);
  },
  sameWonder: function () {
    if (_.isUndefined(this.votes.pollvotedPosts)) {
      return 0;
    }
    var other = this.votes.pollvotedPosts,
        self = Meteor.user().votes.pollvotedPosts,
        togetherIds = _.pluck(self.concat(other), 'itemId'),
        togetherLength = togetherIds.length;
    return Math.round( ( ( togetherLength - (_.uniq(togetherIds).length ) ) / togetherLength) * 100 );
  },
  sharedOpinion: function () {
    if (_.isUndefined(this.votes.pollvotedPosts)) {
      return 0;
    }
    var other = this.votes.pollvotedPosts,
        self = Meteor.user().votes.pollvotedPosts,
        together = self.concat(other),
        selfItemIds = _.pluck(self, 'itemId'),
        otherItemIds = _.pluck(other, 'itemId'),
        sameIds = _.intersection(selfItemIds, otherItemIds),
        sameVotes = [];

    for (var i=0, l=together.length; i<l; i++) {
      if ( _.contains(sameIds,together[i].itemId) && !_.isUndefined(together[i].voteOrder) ) {
        sameVotes.push(together[i].itemId+"-"+together[i].voteOrder);
      }
    } 

    if (_.isEmpty(sameVotes)) {
      return 0;
    }

    return Math.round( ( (sameVotes.length - _.uniq(sameVotes).length) / sameIds.length ) * 100 );

  },
  notSelf: function () {
    return Meteor.user()._id !== this._id;
  }
});

Template[getTemplate('userInfo')].events({
  'click .invite-link': function(e, instance){
    Meteor.call('inviteUser', instance.data.user._id);
    flashMessage('Thanks, user has been invited.', "success");
  }
});
