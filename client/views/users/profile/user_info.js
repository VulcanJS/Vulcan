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
        self = Meteor.user().votes.pollvotedPosts;
    var common = _.pluck(self.concat(other), 'itemId');
    return Math.round( (_.union(common).length / common.length) * 100 );
  },
  sharedOpinion: function () {
    if (_.isUndefined(this.votes.pollvotedPosts)) {
      return 0;
    }
    var other = this.votes.pollvotedPosts,
        self = Meteor.user().votes.pollvotedPosts,
        common = self.concat(other),
        itemIds = _.pluck(self.concat(other), 'itemId'),
        sameIds = _.union(itemIds),
        cleanCommon = [];

    for (var i=0, l=common.length; i<l; i++) {
      if ( _.contains(sameIds,common[i].itemId) && !_.isUndefined(common[i].voteOrder) ) {
        cleanCommon.push(common[i].itemId+"-"+common[i].voteOrder);
      }
    } 

    if (_.isEmpty(cleanCommon)) {
      return 0;
    }

    return Math.round( (_.union(cleanCommon).length / (sameIds.length / 2) ) * 100 );

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
