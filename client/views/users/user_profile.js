Template[getTemplate('user_profile')].helpers({
  avatarUrl: function() {
    return getAvatarUrl(this);
  },
  canEditProfile: function() {
    var currentUser = Meteor.user();
    return currentUser && (this._id == currentUser._id || isAdmin(currentUser))
  },
  createdAtFormatted: function() {
    return this.createdAt;
  },
  canInvite: function() {
    // if the user is logged in, the target user hasn't been invited yet, invites are enabled, and user is not viewing their own profile
    return Meteor.user() && Meteor.user()._id != this._id && !isInvited(this) && invitesEnabled() && canInvite(Meteor.user());
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
  posts: function () {
    return Posts.find({userId: this._id});
  },
  upvotedPosts: function () {
    // extend upvotes with each upvoted post
    if(!!this.votes.upvotedPosts){
      var extendedVotes = this.votes.upvotedPosts.map(function (item) {
        var post = Posts.findOne(item.itemId);
        return _.extend(item, post);
      });
      return extendedVotes
    }
  },
  downvotedPosts: function () {
    // extend upvotes with each upvoted post
    if(!!this.votes.downvotedPosts){
      var extendedVotes = this.votes.downvotedPosts.map(function (item) {
        var post = Posts.findOne(item.itemId);
        return _.extend(item, post);
      });
      return extendedVotes
    }
  },  
  comments: function () {
    var comments = Comments.find({userId: this._id})
    if(!!comments){
      // extend comments with each commented post
      var extendedComments = comments.map(function (comment) {
        var post = Posts.findOne(comment.postId);
        if(post) // post might not be available anymore
          comment.postTitle = post.title;
        return comment;
      });
      return extendedComments    
    }
  }
});

Template[getTemplate('user_profile')].events({
  'click .invite-link': function(e, instance){
    Meteor.call('inviteUser', instance.data.user._id);
    throwError('Thanks, user has been invited.')
  }
});