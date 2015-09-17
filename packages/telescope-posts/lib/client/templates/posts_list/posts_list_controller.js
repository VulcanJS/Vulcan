// see https://www.discovermeteor.com/blog/template-level-subscriptions/

/*

This template acts as the controller that sets and manages the reactive context 
for the embedded postsList template. It receives its parameters from a "caller" template.

*/

Template.posts_list_controller.onCreated(function () {

  // 1. Initialization (*not* reactive!)
  var template = this;

  // initialize the reactive variables
  template.terms = new ReactiveVar(template.data.terms);
  template.postsLimit = new ReactiveVar(template.data.terms.limit || Settings.get('postsPerPage', 10));
  template.ready = new ReactiveVar(false);

  // if caching is set to true, use Subs Manager. Else use template.subscribe. Default to false
  var enableCache = (typeof template.data.terms.enableCache === "undefined") ? false : template.data.terms.enableCache;
  var subscriber = enableCache ? Telescope.subsManager : template;

  // enable not subscribing to users on a per-controller basis
  var subscribeToUsers = (typeof template.data.terms.subscribeToUsers === "undefined") ? true : template.data.terms.subscribeToUsers;

  // 2. Autorun

  // Autorun 1: when terms change, reset the limit
  template.nonReactiveTerms = template.data.terms;
  template.autorun(function () {
    
    // console.log('// ------ autorun 1 ------ //');

    // add a dependency on data context to trigger the autorun
    var newTerms = Template.currentData().terms; // ⚡ reactive ⚡
    
    // compare new terms with previous ones
    if (!_.isEqual(newTerms, template.nonReactiveTerms)) {
      template.nonReactiveTerms = newTerms;
      template.postsLimit.set(template.data.terms.limit || Settings.get('postsPerPage', 10));
    }

  });

  // Autorun 2: will re-subscribe when limit or terms are changed
  template.autorun(function () {

    // console.log('// ------ autorun 2 ------ //');

    // set ready to false
    template.ready.set(false);
    var subscriptionsReady = false;

    // get terms from data context
    var terms = Template.currentData().terms; // ⚡ reactive ⚡

    // add current userId to terms // why do we need to do this?
    // terms.userId = Meteor.userId();
    
    // get limit from local template variable
    var postsLimit = template.postsLimit.get(); // ⚡ reactive ⚡

    // create new subscriptionTerms object using the new limit
    var subscriptionTerms = _.extend(_.clone(terms), {limit: postsLimit}); // extend terms with limit

    // use this new object to subscribe
    var postsSubscription = subscriber.subscribe('postsList', subscriptionTerms);
    if (subscribeToUsers) {
      var usersSubscription = subscriber.subscribe('postsListUsers', subscriptionTerms);
    }

    // Autorun 3: when subscription is ready, update the data helper's terms
    Tracker.autorun(function () {

      if (subscribeToUsers) {
        subscriptionsReady = postsSubscription.ready() && usersSubscription.ready(); // ⚡ reactive ⚡
      } else {
        subscriptionsReady = postsSubscription.ready(); // ⚡ reactive ⚡
      }

      // console.log('// ------ autorun 3 ------ //');
      // console.log("terms: ", terms);
      // console.log("limit: ", postsLimit);
      // console.log("ready: ", subscriptionsReady);

      // if subscriptions are ready, set terms to subscriptionsTerms
      if (subscriptionsReady) {
        template.terms.set(subscriptionTerms);
        template.ready.set(true);
      }
    });
  
  });

});

Template.posts_list_controller.helpers({
  template: function () {
    return !!this.template? this.template: "posts_list";
  },
  data: function () {

    // console.log("// -------- data -------- //")

    var context = this;

    var instance = Template.instance();

    var terms = instance.terms.get(); // ⚡ reactive ⚡
    var postsReady = instance.ready.get(); // ⚡ reactive ⚡

    var postsLimit = terms.limit;
    var parameters = Posts.parameters.get(terms);
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