Template[getTemplate('userUpvotedPosts')].created = function () {
  Session.set('upvotedPostsShown', 5);
  var user = this.data;
  var terms = {};
  Tracker.autorun(function () {
    terms = {
      view: 'upvotedPosts',
      userId: user._id,
      limit: Session.get('upvotedPostsShown')
    }
    coreSubscriptions.subscribe('userUpvotedPosts', terms);
  });
};

Template[getTemplate('userUpvotedPosts')].helpers({
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
    return !!this.votes.upvotedPosts && this.votes.upvotedPosts.length >= Session.get('upvotedPostsShown');
  }
});

Template[getTemplate('userUpvotedPosts')].events({
  'click .upvotedposts-more': function (e) {
    e.preventDefault();
    var upvotedPostsShown = Session.get('upvotedPostsShown');
    Session.set('upvotedPostsShown', upvotedPostsShown + 10);
  }
});