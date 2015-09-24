// see https://www.discovermeteor.com/blog/template-level-subscriptions/

var debug = false;

/*

This template acts as the controller that sets and manages the reactive context 
for the embedded postsList template. It receives its parameters from a "caller" template.

The goal is to resubscribe when either one of the following events happens: 
- The external data context passed to the template from its parent changes
- The template's own internal rLimit ReactiveVar changes

In both cases, the template should resubscribe to the publication, and then once the subscription is ready
update the terms used by the template helper's Posts.find(). 

*/

Template.posts_list_controller.onCreated(function () {

  // 1. Initialization (*not* reactive!)
  var template = this;
  var terms = _.clone(template.data.terms);
  var limit = Settings.get('postsPerPage', 10);
  var postsSubscription;
  var usersSubscription;
  var subscriptionTerms;

  // initialize the reactive variables
  template.rTerms = new ReactiveVar(terms);
  template.rLimit = new ReactiveVar(limit);
  template.rReady = new ReactiveVar(false);

  // if caching is set to true, use Subs Manager. Else use template.subscribe. Default to false
  var enableCache = (typeof terms.enableCache === "undefined") ? false : terms.enableCache;
  var subscriber = enableCache ? Telescope.subsManager : template;

  // enable not subscribing to users on a per-controller basis
  var subscribeToUsers = (typeof terms.subscribeToUsers === "undefined") ? true : terms.subscribeToUsers;

  // Autorun 1: reruns when Template.currentData().terms changes (and new terms are different from old ones),
  // or when post limit changes. On first run, terms and limit won't have had time to change yet, so just
  // do nothing
  template.autorun(function (computation) {


    // add a dependency on data context to trigger the autorun
    var newTerms = Template.currentData().terms; // ⚡ reactive ⚡

    // get limit from local template variable
    var rLimit = template.rLimit.get(); // ⚡ reactive ⚡
        
    if (!computation.firstRun) {

      if (debug) {
        console.log('// ------ autorun 1 ------ //');
        console.log("terms: ", _.clone(terms));
        console.log("newTerms: ", _.clone(newTerms));
        console.log("isEqual?: ", _.isEqual(newTerms, terms));
        console.log("oldLimit: ", limit);
        console.log("newLimit: ", rLimit);
      }

      if (!_.isEqual(newTerms, terms)) {
        // Case 1: terms have changed
        // Note: if terms have changed, we reset the limit no matter its value

        // update terms
        terms = newTerms;

        // reset limit
        limit = Settings.get('postsPerPage', 10);

      } else if (rLimit !== limit) {
        // Case 2: limit has changed

        // update limit
        limit = rLimit;
      
      }

      // set template.rReady to false to trigger Autorun 2
      template.rReady.set(false);
    }

  });

  // Autorun 2: runs once on load, then reruns when template.rReady changes
  // On first run, we subscribe with the original terms andlimit
  template.autorun(function () {

    var ready = template.rReady.get(); // ⚡ reactive ⚡

    // if ready is false, (re)subscribe
    if (!ready) {
      
      subscriptionTerms = _.clone(terms);
      subscriptionTerms.limit = limit;

      if (debug) {
        console.log('// ------ autorun 2 ------ //');
        console.log("subscriptionTerms: ", subscriptionTerms);
        console.log("template.rReady: ", ready);
      }

      // subscribe to posts and (optionally) users
      postsSubscription = subscriber.subscribe('postsList', subscriptionTerms);
      if (subscribeToUsers) {
        usersSubscription = subscriber.subscribe('postsListUsers', subscriptionTerms);
      }

      // Autorun 3: when subscription is ready, update the data helper's terms
      // On the first run, the subscription won't be ready yet so there is no need to update the terms
      // Note: this needs to be nested inside Autorun 2 because it needs to re-run even when
      // subscription.ready() is already ready (because of subscription caching)
      Tracker.autorun(function (computation) {

        var subscriptionsReady;

        if (subscribeToUsers) {
          subscriptionsReady = postsSubscription.ready() && usersSubscription.ready(); // ⚡ reactive ⚡
        } else {
          subscriptionsReady = postsSubscription.ready(); // ⚡ reactive ⚡
        }

        // if (!computation.firstRun) {

          if (debug) {
            console.log('// ------ autorun 3 ------ //');
            console.log("subscriptionsReady: ", subscriptionsReady);
          }

          // if subscriptions are ready, set terms to subscriptionsTerms
          if (subscriptionsReady) {
            template.rTerms.set(subscriptionTerms);
            template.rReady.set(true);
          }

        // }
      });
    }

  });

 

});

Template.posts_list_controller.helpers({
  template: function () {
    return !!this.template? this.template: "posts_list";
  },
  data: function () {

    var context = this;

    var template = Template.instance();

    var terms = template.rTerms.get(); // ⚡ reactive ⚡
    var postsReady = template.rReady.get(); // ⚡ reactive ⚡

    var parameters = Posts.parameters.get(terms);
    var postsCursor = Posts.find(parameters.find, parameters.options);

    // if (debug) {
    //   console.log("// -------- data -------- //")
    //   console.log("terms: ", terms);
    // }

    var data = {

      // posts cursor
      postsCursor: postsCursor,

      // posts subscription readiness, used to show spinner
      postsReady: postsReady,

      // whether to show the load more button or not
      hasMorePosts: postsCursor.count() >= terms.limit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (template) {
        // increase limit by 5 and update it
        var limit = template.rLimit.get();
        limit += Settings.get('postsPerPage', 10);
        template.rLimit.set(limit);

      },

      // the current instance
      controllerInstance: template,

      controllerOptions: context.options // pass any options on to the template

    };

    return data;
  }
});