// see https://www.discovermeteor.com/blog/template-level-subscriptions/

/*

This template acts as the controller that sets and manages the reactive data context 
for the embedded postsList template. 

It doesn't care if it receives its context from the router or from another template. 

*/

Template.postsListController.onCreated(function () {

  var instance = this;

  // if a limit is provided by the data context use this, else use default
  var limit = !!instance.data.terms.limit ? instance.data.terms.limit : Settings.get('postsPerPage', 10);

  // initialize postsLimit template instance reactive variable
  instance.postsLimit = new ReactiveVar(limit);

});

Template.postsListController.helpers({
  context: function () {

    var instance = Template.instance();

    // get terms from data context
    var terms = this.terms; // ⚡ reactive ⚡

    // get limit from template instance reactive variable
    var postsLimit = instance.postsLimit.get(); // ⚡ reactive ⚡

    // use limit to get subscriptions terms, then subscribe
    var subscriptionTerms = _.extend(_.clone(terms), {limit: postsLimit}); // extend terms with limit
    var postsSubscription = instance.subscribe('postsList', subscriptionTerms);
    var usersSubscription = instance.subscribe('postsListUsers', subscriptionTerms);
    var subscriptionsReady = instance.subscriptionsReady(); // ⚡ reactive ⚡

    // if subscriptions are ready, update query terms to match the ones we subscribed with
    if (subscriptionsReady) {
      terms = subscriptionTerms;
    }

    // console.log('// ------ context running ------ //');
    // console.log("terms: ", terms);
    // console.log("limit: ", postsLimit);
    // console.log("ready: ", subscriptionsReady);

    var parameters = Posts.getSubParams(terms);
    var postsCursor = Posts.find(parameters.find, parameters.options);

    var context = {

      // posts cursor
      postsCursor: postsCursor,

      // posts subscription readiness, used to show spinner
      postsReady: subscriptionsReady,

      // whether to show the load more button or not
      hasMorePosts: postsCursor.count() >= postsLimit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (instance) {
        event.preventDefault();
        var limit = instance.postsLimit.get();
        // increase limit by 5 and update instance variable
        limit += Settings.get('postsPerPage', 10);
        instance.postsLimit.set(limit);
        //TODO: also update URL
      },

      // the current instance
      controllerInstance: instance

    };

    return context;
  }
});
