// see https://www.discovermeteor.com/blog/template-level-subscriptions/

/*

This template acts as the controller that sets and manages the reactive context 
for the embedded postsList template. It receives its parameters from a "caller" template.

The goal is to resubscribe when either one of the following events happens: 
- The external data context passed to the template from its parent changes
- The template's own internal postsLimit ReactiveVar changes

In both cases, the template should resubscribe to the publication, and then once the subscription is ready
update the terms used by the template helper's Posts.find(). 

*/

Template.posts_list_controller.onCreated(function () {

  // 1. Initialization (*not* reactive!)
  var template = this;
  var terms = template.data.terms;
  var postsSubscription;
  var usersSubscription;

  // if terms don't have a limit, assign one
  if (!terms.limit) {
    terms.limit = Settings.get('postsPerPage', 10);
  }

  // if user is logged in, add their id to terms
  if (Meteor.userId()) {
    terms.userId = Meteor.userId();
  }

  // initialize the reactive variables
  template.terms = new ReactiveVar(terms);
  template.postsLimit = new ReactiveVar(terms.limit);
  template.ready = new ReactiveVar(false);

  // if caching is set to true, use Subs Manager. Else use template.subscribe. Default to false
  var enableCache = (typeof terms.enableCache === "undefined") ? false : terms.enableCache;
  var subscriber = enableCache ? Telescope.subsManager : template;

  // enable not subscribing to users on a per-controller basis
  var subscribeToUsers = (typeof terms.subscribeToUsers === "undefined") ? true : terms.subscribeToUsers;

  // Autorun 1: reruns when Template.currentData().terms changes *and* terms have actually changed
  template.autorun(function (computation) {

    // add a dependency on data context to trigger the autorun
    var newTerms = Template.currentData().terms; // ⚡ reactive ⚡
    var oldTerms = _.clone(terms);

    delete oldTerms.userId;
    delete oldTerms.limit;
    
    if (!computation.firstRun) {

      // console.log('// ------ autorun 1 ------ //');
      // console.log("newTerms: ", _.clone(newTerms));
      // console.log("oldTerms: ", _.clone(oldTerms));
      // console.log("isEqual?: ", _.isEqual(newTerms, oldTerms));

      // compare new terms with previous ones (minus userId and limit)
      if (!_.isEqual(newTerms, oldTerms)) {

        // if terms have changed, reset postsLimit
        newTerms.limit = Settings.get('postsPerPage', 10);

        // update terms
        terms = newTerms;

        // set template.ready to false to trigger Autorun 3
        template.ready.set(false);

      }
    }

  });

  // Autorun 2: reruns when template.postsLimit changes
  template.autorun(function (computation) {

    // get limit from local template variable
    var postsLimit = template.postsLimit.get(); // ⚡ reactive ⚡

    if (!computation.firstRun) {

      // console.log('// ------ autorun 2 ------ //');

      // update limit
      terms.limit = postsLimit;

      // set template.ready to false to trigger Autorun 3
      template.ready.set(false);

    }
  });

  // Autorun 3: runs once on load, then reruns when template.ready changes
  template.autorun(function () {

    var ready = template.ready.get(); // ⚡ reactive ⚡

    // if ready is false, (re)subscribe
    if (!ready) {
      
      // console.log('// ------ autorun 3 ------ //');
      // console.log("terms: ", terms);

      // subscribe to posts and (optionally) users
      postsSubscription = subscriber.subscribe('postsList', terms);
      if (subscribeToUsers) {
        usersSubscription = subscriber.subscribe('postsListUsers', terms);
      }

      // Autorun 4: when subscription is ready, update the data helper's terms
      Tracker.autorun(function () {
      
        var subscriptionsReady;

        if (subscribeToUsers) {
          subscriptionsReady = postsSubscription.ready() && usersSubscription.ready(); // ⚡ reactive ⚡
        } else {
          subscriptionsReady = postsSubscription.ready(); // ⚡ reactive ⚡
        }

        // console.log('// ------ autorun 4 ------ //');
        // console.log("terms: ", terms);
        // console.log("ready: ", subscriptionsReady);

        // if subscriptions are ready, set terms to subscriptionsTerms
        if (subscriptionsReady) {
          template.terms.set(terms);
          template.ready.set(true);
        }

      });
    }

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

    // console.log(terms)

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