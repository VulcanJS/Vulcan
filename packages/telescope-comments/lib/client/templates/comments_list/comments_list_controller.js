// see https://www.discovermeteor.com/blog/template-level-subscriptions/

/*

This template acts as the controller that sets and manages the reactive context 
for the embedded commentsList template. It receives its parameters from a "caller" template.

*/

Template.commentsListController.onCreated(function () {

  // 1. Initialization (*not* reactive!)
  var instance = this;

  // initialize the reactive variables
  instance.terms = new ReactiveVar(instance.data.terms);
  instance.commentsLimit = new ReactiveVar(Settings.get('commentsPerPage', 5));

  // 2. Autorun

  // Autorun 1: when terms change, reset the limit
  instance.autorun(function () {
    // add a dependency on data context to trigger the autorun
    var terms = Template.currentData().terms; // ⚡ reactive ⚡
    instance.commentsLimit.set(Settings.get('commentsPerPage', 5));
  });

  // Autorun 2: will re-run when limit or terms are changed
  instance.autorun(function () {

    // get terms from data context
    var terms = Template.currentData().terms; // ⚡ reactive ⚡

    // get limit from local template variable
    var commentsLimit = instance.commentsLimit.get(); // ⚡ reactive ⚡

    // create new subscriptionTerms object using the new limit
    var subscriptionTerms = _.extend(_.clone(terms), {limit: commentsLimit}); // extend terms with limit

    // use this new object to subscribe
    var commentsSubscription = instance.subscribe('commentsList', subscriptionTerms);

    var subscriptionsReady = instance.subscriptionsReady(); // ⚡ reactive ⚡

    // console.log('// ------ autorun running ------ //');
    // console.log("terms: ", terms);
    // console.log("limit: ", commentsLimit);
    // console.log("ready: ", subscriptionsReady);
    // Tracker.onInvalidate(console.trace.bind(console));

    // if subscriptions are ready, set terms to subscriptionsTerms
    if (subscriptionsReady) {
      instance.terms.set(subscriptionTerms);
    }
  
  });

});

Template.commentsListController.helpers({
  template: function () {
    return !!this.template? this.template: "comments_list";
  },
  data: function () {

    var context = this;

    var instance = Template.instance();

    var terms = instance.terms.get(); // ⚡ reactive ⚡
    var commentsReady = instance.subscriptionsReady(); // ⚡ reactive ⚡

    var commentsLimit = terms.limit;
    var parameters = Comments.getSubParams(terms);
    var commentsCursor = Comments.find(parameters.find, parameters.options);

    var data = {

      // comments cursor
      commentsCursor: commentsCursor,

      // comments subscription readiness, used to show spinner
      commentsReady: commentsReady,

      // whether to show the load more button or not
      hasMorecomments: commentsCursor.count() >= commentsLimit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (instance) {
        event.preventDefault();

        // increase limit by 5 and update it
        var limit = instance.commentsLimit.get();
        limit += Settings.get('commentsPerPage', 5);
        instance.commentsLimit.set(limit);

      },

      // the current instance
      controllerInstance: instance,

      controllerOptions: context.options // pass any options on to the template

    };

    // console.log(data)
    return data;
  }
});