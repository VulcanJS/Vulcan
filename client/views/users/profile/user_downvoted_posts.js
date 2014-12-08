Template[getTemplate('userDownvotedPosts')].created = function () {
  Session.set('downvotedPostsShown', 5);
  var user = this.data;
  var terms = {};
  Tracker.autorun(function () {
    terms = {
      view: 'downvotedPosts',
      userId: user._id,
      limit: Session.get('downvotedPostsShown')
    }
    coreSubscriptions.subscribe('userDownvotedPosts', terms);
  });
};

Template[getTemplate('userDownvotedPosts')].helpers({
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
    return !!this.votes.downvotedPosts && this.votes.downvotedPosts.length >= Session.get('downvotedPostsShown');
  }
});

Template[getTemplate('userDownvotedPosts')].events({
  'click .downvotedposts-more': function (e) {
    e.preventDefault();
    var downvotedPostsShown = Session.get('downvotedPostsShown');
    Session.set('downvotedPostsShown', downvotedPostsShown + 10);
  }
});