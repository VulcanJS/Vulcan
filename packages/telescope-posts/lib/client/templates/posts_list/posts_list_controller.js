// see https://www.discovermeteor.com/blog/template-level-subscriptions/

/*

This template acts as the controller that sets and manages the reactive context 
for the embedded postsList template. It receives its parameters from a "caller" template.

*/


Template.postsListController.onCreated(function () {

  // 1. Initialization (*not* reactive!)
  var instance = this;
  var terms = instance.data.terms; // provided by the caller template


  // if terms doesn't have a limit, set one
  if (!terms.limit) {
    terms.limit = Settings.get('postsPerPage', 10);
  }

  // initialize the reactive variables
  instance.postsLoaded = new ReactiveVar(0);
  instance.terms = new ReactiveVar(terms);

  // 2. Autorun

  // will re-run when terms are changed, either by the router or by the template itself
  instance.autorun(function () {

    // console.log('// ⚡ autorun ------------------------');

    // ⚡ reactive variables ⚡
    var routerTerms = Router.current().data().terms; // get terms from router (category, date, etc.)
    var instanceTerms = instance.terms.get(); // get terms from instance (posts limit)

    var terms = _.extend(instanceTerms, routerTerms); // merge both

    var subsReady = instance.subscriptionsReady();

    // console.log("> Asking for " + terms.limit + " posts…");

    // subscribe
    var postsSubscription = instance.subscribe('postsList', terms);
    var usersSubscription = instance.subscribe('postsListUsers', terms);

    // if subscriptions are ready, set limit to newLimit
    if (subsReady) {

      // console.log("> Received "+terms.limit+" posts.");
      instance.postsLoaded.set(terms.limit);

    } else {
      // console.log("> Subscriptions are not ready yet.");
    }
  
  });

  // 3. Cursor

  instance.getPostsCursor = function() {

    // console.log('// cursor ----------')
    // console.log('> actually loaded ' + instance.postsLoaded.get() + ' posts')

    var termsGet = _.clone(instance.terms.get());
    var termsLoaded = _.extend(termsGet, {limit: instance.postsLoaded.get()});
    var parameters = Posts.getSubParams(termsLoaded);

    return Posts.find(parameters.find, parameters.options);
  };

});

Template.postsListController.helpers({
  context: function () {

    // console.log('// context ---------')
    
    // create context for postsList module
    var instance = Template.instance();

    // ⚡ reactive variables ⚡
    var terms = instance.terms.get();
    var postsCursor = instance.getPostsCursor();
    var postsReady = instance.subscriptionsReady();

    var context = {

      // posts cursor
      postsCursor: postsCursor,

      // posts subscription readiness, used to show spinner
      postsReady: postsReady,

      // whether to show the load more button or not
      hasMorePosts: postsCursor.count() >= terms.limit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (instance) {
        event.preventDefault();

        // increase limit by 5 and update terms
        terms.limit += Settings.get('postsPerPage', 10);
        instance.terms.set(terms);

      },

      // the current instance
      controllerInstance: instance

    };

    return context;
  }
});
