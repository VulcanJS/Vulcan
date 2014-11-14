Template[getTemplate('user_profile')].created = function () {
  Session.set('postsShown', 5);
  Session.set('upvotedPostsShown', 5);
  Session.set('downvotedPostsShown', 5);
  Session.set('commentsShown', 5);
};

Template[getTemplate('user_profile')].helpers({
  canEditProfile: function() {
    var currentUser = Meteor.user();
    return currentUser && (this._id == currentUser._id || isAdmin(currentUser));
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
    return Posts.find({userId: this._id}, {limit: Session.get('postsShown')});
  },
  hasMorePosts: function () {
    return Posts.find({userId: this._id}).count() > Session.get('postsShown');
  },
  upvotedPosts: function () {
    // extend upvotes with each upvoted post
    if(!!this.votes.upvotedPosts){
      var extendedVotes = this.votes.upvotedPosts.map(function (item) {
        var post = Posts.findOne(item.itemId);
        return _.extend(item, post);
      });
      return _.first(extendedVotes, Session.get('upvotedPostsShown'));
    }
  },
  hasMoreUpvotedPosts: function () {
    return !!this.votes.upvotedPosts && this.votes.upvotedPosts.length > Session.get('upvotedPostsShown');
  },
  downvotedPosts: function () {
    // extend upvotes with each upvoted post
    if(!!this.votes.downvotedPosts){
      var extendedVotes = this.votes.downvotedPosts.map(function (item) {
        var post = Posts.findOne(item.itemId);
        return _.extend(item, post);
      });
      return _.first(extendedVotes, Session.get('downvotedPostsShown'));
    }
  },
  hasMoreDownvotedPosts: function () {
    return !!this.votes.downvotedPosts && this.votes.downvotedPosts.length > Session.get('downvotedPostsShown');
  },
  comments: function () {
    var comments = Comments.find({userId: this._id}, {limit: Session.get('commentsShown')});
    if(!!comments){
      // extend comments with each commented post
      var extendedComments = comments.map(function (comment) {
        var post = Posts.findOne(comment.postId);
        if(post) // post might not be available anymore
          comment.postTitle = post.title;
        return comment;
      });
      return extendedComments;
    }
  },
  hasMoreComments: function () {
    return Comments.find({userId: this._id}).count() > Session.get('commentsShown');
  }
});

Template[getTemplate('user_profile')].events({
  'click .invite-link': function(e, instance){
    Meteor.call('inviteUser', instance.data.user._id);
    throwError('Thanks, user has been invited.');
  },
  'click .posts-more': function (e) {
    e.preventDefault();
    var postsShown = Session.get('postsShown');
    Session.set('postsShown', postsShown + 10);
  },
  'click .upvotedposts-more': function (e) {
    e.preventDefault();
    var upvotedPostsShown = Session.get('upvotedPostsShown');
    Session.set('upvotedPostsShown', upvotedPostsShown + 10);
  },
  'click .downvotedposts-more': function (e) {
    e.preventDefault();
    var downvotedPostsShown = Session.get('downvotedPostsShown');
    Session.set('downvotedPostsShown', downvotedPostsShown + 10);
  },
  'click .comments-more': function (e) {
    e.preventDefault();
    var commentsShown = Session.get('commentsShown');
    Session.set('commentsShown', commentsShown + 10);
  }
});