// see https://www.discovermeteor.com/blog/template-level-subscriptions/

/*

This template acts as the controller that sets and manages the reactive context 
for the embedded postsList template. It receives its parameters from a "caller" template.

*/

Template.posts_list_controller.onCreated(function () {

  // 1. Initialization (*not* reactive!)
  var instance = this;

  // initialize the reactive variables
  instance.terms = new ReactiveVar(instance.data.terms);
  instance.postsLimit = new ReactiveVar(instance.data.terms.limit || Settings.get('postsPerPage', 10));
  instance.ready = new ReactiveVar(false);

  // if caching is set to true, use Subs Manager. Else use template.subscribe. Default to false
  var enableCache = (typeof instance.data.terms.enableCache === "undefined") ? false : instance.data.terms.enableCache;
  var subscriber = enableCache ? Telescope.subsManager : instance;

  // enable not subscribing to users on a per-controller basis
  var subscribeToUsers = (typeof instance.data.terms.subscribeToUsers === "undefined") ? true : instance.data.terms.subscribeToUsers;

  // 2. Autorun

  // Autorun 1: when terms change, reset the limit
  instance.autorun(function () {
    // add a dependency on data context to trigger the autorun
    var newTerms = Template.currentData().terms; // ⚡ reactive ⚡
    if (!_.isEqual(newTerms, instance.data.terms)) {
      instance.postsLimit.set(instance.data.terms.limit || Settings.get('postsPerPage', 10));
    }
  });

  // Autorun 2: will re-run when limit or terms are changed
  instance.autorun(function () {

    // get terms from data context
    var terms = Template.currentData().terms; // ⚡ reactive ⚡

    // get limit from local template variable
    var postsLimit = instance.postsLimit.get(); // ⚡ reactive ⚡

    // create new subscriptionTerms object using the new limit
    var subscriptionTerms = _.extend(_.clone(terms), {limit: postsLimit}); // extend terms with limit

    // use this new object to subscribe
    var postsSubscription = subscriber.subscribe('postsList', subscriptionTerms);

    if (subscribeToUsers) {
      var usersSubscription = subscriber.subscribe('postsListUsers', subscriptionTerms);
      var subscriptionsReady = postsSubscription.ready() && usersSubscription.ready(); // ⚡ reactive ⚡
    } else {
      var subscriptionsReady = postsSubscription.ready(); // ⚡ reactive ⚡
    }

    // console.log('// ------ autorun running ------ //');
    // console.log("terms: ", terms);
    // console.log("limit: ", postsLimit);
    // console.log("ready: ", subscriptionsReady);
    // Tracker.onInvalidate(console.trace.bind(console));

    // if subscriptions are ready, set terms to subscriptionsTerms
    if (subscriptionsReady) {
      instance.terms.set(subscriptionTerms);
      instance.ready.set(true);
    }
  
  });

});

Template.posts_list_controller.helpers({
  template: function () {
    return !!this.template? this.template: "posts_list";
  },
  data: function () {

    var context = this;

    var instance = Template.instance();

    var terms = instance.terms.get(); // ⚡ reactive ⚡
    var postsReady = instance.ready.get(); // ⚡ reactive ⚡

    var postsLimit = terms.limit;
    var parameters = Posts.getSubParams(terms);
    var postsCursor = Posts.find(parameters.find, parameters.options);

    var data = {

      // posts cursor
      postsCursor: postsCursor,

      // posts subscription readiness, used to show spinner
      postsReady: postsReady,

      // whether to show the load more button or not
      hasMorePosts: postsCursor.count() >= postsLimit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (instance) {
        // increase limit by 5 and update it
        var limit = instance.postsLimit.get();
        limit += Settings.get('postsPerPage', 10);
        instance.postsLimit.set(limit);

      },

      // the current instance
      controllerInstance: instance,

      controllerOptions: context.options // pass any options on to the template

    };

    return data;
  }
});