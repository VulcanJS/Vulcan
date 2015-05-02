// see https://www.discovermeteor.com/blog/template-level-subscriptions/

/*

This template acts as the controller that sets and manages the reactive context 
for the embedded postsList template. It receives its parameters from a "caller" template.

*/

Template.postsListController.created = function () {

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

  // will re-run when terms changes
  instance.autorun(function () {

    // ⚡ reactive variables ⚡
    var termsGet = instance.terms.get();

    var subsReady = instance.subscriptionsReady();

    // console.log('// ⚡ autorun ------------------------')
    // console.log("> Asking for " + termsGet.limit + " posts…")

    // subscribe
    var postsSubscription = instance.subscribe('postsList', termsGet);
    var usersSubscription = instance.subscribe('postsListUsers', termsGet);

    // if subscriptions are ready, set limit to newLimit
    if (subsReady) {

      // console.log("> Received "+termsGet.limit+" posts.")
      instance.postsLoaded.set(termsGet.limit);

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

};

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
