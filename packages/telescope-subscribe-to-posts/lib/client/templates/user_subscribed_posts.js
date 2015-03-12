Template[getTemplate('userSubscribedPosts')].created = function () {
  var user = this.data,
      instance = this;

  // initialize the terms and posts local reactive variables
  instance.terms = new ReactiveVar({
    view: 'userSubscribedPosts',
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
    instance.subscription = Meteor.subscribe('userSubscribedPosts', terms);

    // update the instance's "posts" cursor
    instance.posts.set(Posts.find(parameters.find, parameters.options));
    
  });
};

Template[getTemplate('userSubscribedPosts')].helpers({
  posts: function () {
    var user = this,
        posts = Template.instance().posts.get().fetch();
    posts = _.map(posts, function (post) {
      var item = _.findWhere(user.subscribedItems.Posts, {itemId: post._id});
      post.subscribedAt = item.subscribedAt;
      return post;
    });
    return posts;
  },
  hasMorePosts: function () {
    return Template.instance().posts.get().count() >= Template.instance().terms.get().limit;
  }
});

Template[getTemplate('userSubscribedPosts')].events({
  'click .subscribedposts-more': function (e) {
    e.preventDefault();
    var terms = Template.instance().terms.get();
    terms.limit += 5;
    Template.instance().terms.set(terms)
  }
});
