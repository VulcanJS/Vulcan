Template[getTemplate('userPosts')].created = function () {

  var user = this.data;
  var instance = this;

  // initialize the terms reactive variable
  instance.terms = new ReactiveVar({
    view: 'userPosts',
    userId: user._id,
    limit: 5,
    previousLimit: 0 // should always be equal to limit's previous value
  });

  // initialize the posts cursor ReVar
  instance.posts = new ReactiveVar({});

  // initialize the subscription handle ReVar
  instance.subscription = new ReactiveVar({});

  // will re-run when the "terms" or "subscription" reactive variables change
  this.autorun(function () {

    // get the new terms and generate new parameters from them
    var terms = instance.terms.get();
    var parameters = getPostsParameters(terms);

    // subscribe to the userPosts publication
    instance.subscription.set(Meteor.subscribe('userPosts', terms));

    // until subscription is ready, overwrite limit to restrict number of posts to previousLimit  
    if (!instance.subscription.get().ready())
      parameters.options.limit = terms.previousLimit

    // update the instance's "posts" cursor
    instance.posts.set(Posts.find(parameters.find, parameters.options));

  });
};

Template[getTemplate('userPosts')].helpers({
  posts: function () {
    return Template.instance().posts.get();
  },
  isReady: function () {
    return Template.instance().subscription.get().ready();
  },
  hasMorePosts: function () {
    return Template.instance().posts.get().count() >= Template.instance().terms.get().previousLimit;
  }
});

Template[getTemplate('userPosts')].events({
  'click .posts-more': function (e) {
    e.preventDefault();
    var terms = Template.instance().terms.get();
    // previousLimit starts at 0, so by increasing both values by 5 we keep them 5 apart
    terms.previousLimit += 5;
    terms.limit += 5;
    Template.instance().terms.set(terms)
  }
});