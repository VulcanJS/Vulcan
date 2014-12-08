Template[getTemplate('userPosts')].created = function () {

  var user = this.data;
  var instance = this;

  // initialize the terms local reactive variable
  instance.terms = new ReactiveVar({
    view: 'userPosts',
    userId: user._id,
    limit: 5
  });

  // will re-run when the "terms" local reactive variable changes
  Tracker.autorun(function () {
    coreSubscriptions.subscribe('userPosts', instance.terms.get());
  });
};

Template[getTemplate('userPosts')].helpers({
  posts: function () {
    // access the reactive var on the local instance
    var parameters = getPostsParameters(Template.instance().terms.get());
    var posts = Posts.find(parameters.find, parameters.options)
    return posts;
  },
  hasMorePosts: function () {
    var parameters = getPostsParameters(Template.instance().terms.get());
    var posts = Posts.find(parameters.find, parameters.options)
    return posts.count() >= Session.get('postsShown');
  }
});

Template[getTemplate('userPosts')].events({
  'click .posts-more': function (e) {
    e.preventDefault();
    var terms = Template.instance().terms.get();
    terms.limit += 5;
    Template.instance().terms.set(terms)
  }
});