Template[getTemplate('userDownvotedPosts')].created = function () {

  var user = this.data;
  var instance = this;

  // initialize the terms and posts local reactive variables
  instance.terms = new ReactiveVar({
    view: 'userDownvotedPosts',
    userId: user._id,
    limit: 5
  });
  instance.posts = new ReactiveVar({});

  // will re-run when the "terms" local reactive variable changes
  Tracker.autorun(function () {

    // get the new terms and generate new parameters from them
    var terms = instance.terms.get();
    var parameters = getPostsParameters(terms);

    // subscribe to the userPosts publication
    coreSubscriptions.subscribe('userDownvotedPosts', terms);

    // update the instance's "posts" cursor
    instance.posts.set(Posts.find(parameters.find, parameters.options));
    
  });
};

Template[getTemplate('userDownvotedPosts')].helpers({
  posts: function () {
    return Template.instance().posts.get();
  },
  hasMorePosts: function () {
    return Template.instance().posts.get().count() >= Template.instance().terms.get().limit;
  }
});

Template[getTemplate('userDownvotedPosts')].events({
  'click .downvotedposts-more': function (e) {
    e.preventDefault();
    var terms = Template.instance().terms.get();
    terms.limit += 5;
    Template.instance().terms.set(terms)
  }
});