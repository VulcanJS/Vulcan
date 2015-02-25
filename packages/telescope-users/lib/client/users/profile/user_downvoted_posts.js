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
  this.autorun(function () {

    // get the new terms and generate new parameters from them
    var terms = instance.terms.get();
    var parameters = getPostsParameters(terms);

    // subscribe to the userPosts publication
    instance.subscription = Meteor.subscribe('userDownvotedPosts', terms);

    // update the instance's "posts" cursor
    instance.posts.set(Posts.find(parameters.find, parameters.options));
    
  });
};

Template[getTemplate('userDownvotedPosts')].helpers({
  posts: function () {
    var user = this;
    var posts = Template.instance().posts.get().fetch();
    posts = _.map(posts, function (post) {
      var vote = _.findWhere(user.votes.downvotedPosts, {itemId: post._id});
      post.votedAt = vote.votedAt;
      return post;
    });
    return posts;
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