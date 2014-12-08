Template[getTemplate('userPosts')].created = function () {
  Session.set('postsShown', 5);
  var user = this.data;
  var terms = {};
  Tracker.autorun(function () {
    terms = {
      view: 'userPosts',
      userId: user._id,
      limit: Session.get('postsShown')
    }
    coreSubscriptions.subscribe('userPosts', terms);
  });
};

Template[getTemplate('userPosts')].helpers({
  posts: function () {
    return Posts.find({userId: this._id}, {limit: Session.get('postsShown')});
  },
  hasMorePosts: function () {
    return Posts.find({userId: this._id}).count() >= Session.get('postsShown');
  }
});

Template[getTemplate('userPosts')].events({
  'click .posts-more': function (e) {
    e.preventDefault();
    var postsShown = Session.get('postsShown');
    Session.set('postsShown', postsShown + 10);
  }
});