Template[getTemplate('poll_avatars')].helpers({
  pollVoters: function () {
    // remove post author ID from commenters to avoid showing author's avatar again
    // limit to 4 commenters in case there's more
    // TODO: show a "..." sign or something

    var user = Meteor.user();
  	if (!user || !user.friendsIds) {
    	return _.first(this.data.voters, 5);
  	}
  	var friendsVotes = _.intersection(user.friendsIds, this.data.voters);

  	if (friendsVotes.length >= 5) {
  		return _.first(friendsVotes, 5);
  	} else {
  		withoutIds = _.union(user._id, friendsVotes);
  		return _.union(friendsVotes, _.first(this.data.voters, 5-friendsVotes.length));
  	}

  }
});

Template[getTemplate('poll_avatars')].rendered = function(){
	$('.avatar-link.avatar-small.commenter-avatar').popup();
}