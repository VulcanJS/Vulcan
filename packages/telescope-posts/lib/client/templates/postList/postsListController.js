// see https://www.discovermeteor.com/blog/template-level-subscriptions/

// this template acts as the controller that sets and
// manages the reactive context for the embedded postsList template

Template.postsListController.created = function () {

  // 1. Initialization

  var instance = this;
  // var terms = instance.data.terms; // get terms from context passed to controller

  // terms need to be reactive too!

  // initialize the reactive variables
  instance.postsLoaded = new ReactiveVar(0);
  instance.terms = new ReactiveVar(instance.data.terms);
  // instance.postsLimit = new ReactiveVar(Settings.get('postsPerPage', 10));

  console.log("// terms initialized: ")
  console.log(instance.terms.get())
  // 2. Autorun

  // this autorun is there just to reset the post limit
  // when current date changes (i.e. we're switching page)
  // instance.autorun(function () {
  //   // just by including this session variable in the autorun, we automatically make it depend on it
  //   console.log('resetting…')
  //   var currentDate = Session.get('currentDate');
  //   instance.postsLimit.set(Settings.get('postsPerPage', 10));
  // });

  // will re-run when terms changes
  instance.autorun(function () {

    var termsGet = instance.terms.get();
    // var termsGet = {
    //   view: "top",
    //   limit: 7,
    //   category: undefined,
    //   query: ""
    // };
    // var postsLimit = instance.postsLimit.get();

    console.log('\n\n// autorun')
    // get the postsLimit
    // instance.terms.set(_.extend(terms, {limit: postsLimit}));

    console.log(termsGet)

    // console.log("Asking for " + terms.limit + " posts…")

    // subscribe
    var postsSubscription = instance.subscribe('postsList', termsGet);
    var usersSubscription = instance.subscribe('postsListUsers', termsGet);

    // if subscriptions are ready, set limit to newLimit
    if (instance.subscriptionsReady()) {

      console.log("> Received "+termsGet.limit+" posts. \n\n")
      instance.postsLoaded.set(termsGet.limit);

    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.getPostsCursor = function() {
    console.log('loaded ' + instance.postsLoaded.get() + ' posts\n\n')
    var termsGet = _.clone(instance.terms.get());
    var termsLoaded = _.extend(termsGet, {limit: instance.postsLoaded.get()});
    var parameters = Posts.getSubParams(termsLoaded);
    return Posts.find(parameters.find, parameters.options);
  };

};

Template.postsListController.helpers({
  context: function () {
    // create context for postsList module
    var instance = Template.instance();
    var postsCursor = instance.getPostsCursor();

    var context = {

      // posts cursor
      postsCursor: postsCursor,

      // posts subscription readiness, used to show spinner
      postsReady: instance.subscriptionsReady(),

      // whether to show the load more button or not
      hasMorePosts: postsCursor.count() >= instance.terms.get().limit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (instance) {
        event.preventDefault();

        var termsGet = _.clone(instance.terms.get());
        // increase limit by 5 and update terms
        termsGet.limit += Settings.get('postsPerPage', 10);
        instance.terms.set(termsGet);

        // get current value for limit, i.e. how many posts are currently displayed
        // var limit = instance.postsLimit.get();
        // // increase limit by 5 and update it
        // limit += Settings.get('postsPerPage', 10);
        // instance.postsLimit.set(limit);
      },

      // the current instance
      controllerInstance: instance

    };
    return context;
  }
});
