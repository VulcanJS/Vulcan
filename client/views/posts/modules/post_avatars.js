friendWonder = function(id) {
  var user = Meteor.user();
  if (user && user.friendsWonders) {
    return _.findWhere(user.friendsWonders, {friendId: id});
  }
}

Template[getTemplate('postAvatars')].helpers({
  commenters: function () {
    // remove post author ID from commenters to avoid showing author's avatar again
    // limit to 4 commenters in case there's more
    // TODO: show a "..." sign or something

    var user = Meteor.user();

  	if ( !user || !user.services || !user.services.facebook || !user.services.facebook.friendsIds || !this.facebookVoters) {
  		return _.first(_.without(this.commenters, this.userId), 4);
  	}
  	var friendsVotes = _.intersection(user.friendsIds, this.commenters);

  	if (friendsVotes.length >= 4) {
  		return _.first(friendsVotes, 4);
  	} else {
  		withoutIds = _.union(this.userId,friendsVotes);
  		return _.union(friendsVotes, _.first(_.without(this.commenters, withoutIds), 4-friendsVotes.length));
  	}
    
  },
  friendWonder: function(data) {
    return friendWonder(data);
  },
  friendName: function(data) {
    return friendWonder(data).friendName;
  },
  wonderCount: function(data) {
    return friendWonder(data).wonderCount;
  },
  sharedOpinionCount: function(data) {
    return friendWonder(data).sharedOpinionCount;
  }
});

Template[getTemplate('postAvatars')].rendered = function () {
  $('.avatar-link.avatar-link-popup')
  .popup()
  ;
};