/*

//--------------------------------------------------------------------------------------------------//
//---------------------------------------- Table Of Contents ---------------------------------------//
//--------------------------------------------------------------------------------------------------//

---------------------------------------------------------------
#                             Config                          #
---------------------------------------------------------------

//

---------------------------------------------------------------
#                            Filters                          #
---------------------------------------------------------------

isLoggedIn
isLoggedOut
isAdmin

canView
canPost
canEditPost
canEditComment

hasCompletedProfile

---------------------------------------------------------------
#                          Controllers                        #
---------------------------------------------------------------

PostsListController
PostPageController

---------------------------------------------------------------
#                             Routes                          #
---------------------------------------------------------------

1) Paginated Lists
----------------------
Top
New
Best
Pending
Categories

2) Digest
--------------------
Digest

3) Posts
--------------------
Post Page
Post Page (scroll to comment)
Post Edit
Post Submit

4) Comments
--------------------
Comment Page
Comment Edit
Comment Submit

5) Users
--------------------
User Profie
User Edit
Forgot Password
Account
All Users
Unsubscribe (from notifications)
Sign Up
Sign In

6) Misc Routes
--------------------
Settings
Categories
Toolbox

7) Server-side
--------------------
API
RSS

*/


//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Config ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//


Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'not_found',
  waitOn: function() {
    return Meteor.subscribe('categories');
  }
});

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Filters --------------------------------------------//
//--------------------------------------------------------------------------------------------------//

var filters = {

  nProgressHook: function () {
    if (this.ready()) {
      NProgress.done(); 
    } else {
      NProgress.start();
      this.stop();
    }
  },

  resetScroll: function () {
    var scrollTo = window.currentScroll || 0;
    $('body').scrollTop(scrollTo);
    $('body').css("min-height", 0);
  },

  isLoggedIn: function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      throwError(i18n.t('Please Sign In First.'))
      this.render('signin');
      this.stop(); 
    }
  },

  isLoggedOut: function() {
    if(Meteor.user()){
      this.render('already_logged_in');
      this.stop();
    }
  },

  isAdmin: function() {
    this.subscribe('currentUser').wait();
    if(!this.ready()) return;
    if(!isAdmin()){
      throwError(i18n.t("Sorry, you  have to be an admin to view this page."))
      this.render('no_rights');
      this.stop(); 
    }
  },

  canView: function() {
    this.subscribe('currentUser').wait();
    this.subscribe('settings').wait();
    if(!this.ready()) return;
    if(!canView()){
      console.log('cannot view')
      this.render('no_rights');
      this.stop();
    }
  },

  canPost: function () {
    this.subscribe('currentUser').wait();
    this.subscribe('settings').wait();
    if(!this.ready()) return;
    if(!canPost()){
      throwError(i18n.t("Sorry, you don't have permissions to add new items."))
      this.render('no_rights');
      this.stop();      
    }
  },

  canEditPost: function() {
    this.subscribe('currentUser').wait();
    if(!this.ready()) return;
    // Already subscribed to this post by route({waitOn: ...})
    var post = Posts.findOne(this.params._id);
    if(!currentUserCanEdit(post)){
      throwError(i18n.t("Sorry, you cannot edit this post."))
      this.render('no_rights');
      this.stop();
    }
  },

  canEditComment: function() {
    this.subscribe('currentUser').wait();
    if(!this.ready()) return;
    // Already subscribed to this commit by CommentPageController
    var comment = Comments.findOne(this.params._id);
    if(!currentUserCanEdit(comment)){
      throwError(i18n.t("Sorry, you cannot edit this comment."))
      this.render('no_rights');
      this.stop();
    }
  },

  hasCompletedProfile: function() {
    this.subscribe('currentUser').wait();
    if(!this.ready()) return;
    var user = Meteor.user();
    if (user && ! userProfileComplete(user)){
      this.render('user_email');
      this.stop();
    }
  }

}

if(Meteor.isClient){

  // Load Hooks

  Router.load( function () {
    clearSeenErrors(); // set all errors who have already been seen to not show anymore
    Session.set('categorySlug', null);

    // if we're not on the search page itself, clear search query and field
    if(getCurrentRoute().indexOf('search') == -1){
      Session.set('searchQuery', '');
      $('.search-field').val('').blur();
    }

  });

  // Before Hooks

  // Use nProgress on every route that has to load a subscription
  Router.before(filters.nProgressHook, {only: [
    'posts_top', 
    'posts_new', 
    'posts_best', 
    'posts_pending', 
    'posts_digest',
    'posts_category',
    'search',
    'post_page',
    'post_edit',
    'comment_page',
    'comment_edit',
    'comment_reply',
    'user_edit',
    'user_profile',
    'all-users',
    'logs'
  ]});

  Router.before(filters.canView);
  Router.before(filters.hasCompletedProfile);
  Router.before(filters.isLoggedIn, {only: ['comment_reply','post_submit']});
  Router.before(filters.isLoggedOut, {only: ['signin', 'signup']});
  Router.before(filters.canPost, {only: ['posts_pending', 'comment_reply', 'post_submit']});
  Router.before(filters.canEditPost, {only: ['post_edit']});
  Router.before(filters.canEditComment, {only: ['comment_edit']});
  Router.before(filters.isAdmin, {only: ['posts_pending', 'all-users', 'settings', 'categories', 'toolbox', 'logs']});

  // After Hooks

  Router.after(filters.resetScroll, {except:['posts_top', 'posts_new', 'posts_best', 'posts_pending', 'posts_category', 'all-users']});
  Router.after( function () {
    analyticsRequest() // log this request with mixpanel, etc
  });

  // Unload Hooks

  //

}

//--------------------------------------------------------------------------------------------------//
//------------------------------------------- Controllers ------------------------------------------//
//--------------------------------------------------------------------------------------------------//


// Controller for all posts lists

PostsListController = FastRender.RouteController.extend({
  template:'posts_list',
  waitOn: function () {
    // take the first segment of the path to get the view, unless it's '/' in which case the view default to 'top'
    // note: most of the time this.params.slug will be empty
    this._terms = {
      view: this.path == '/' ? 'top' : this.path.split('/')[1],
      limit: this.params.limit || getSetting('postsPerPage', 10),
      category: this.params.slug
    };

    if(Meteor.isClient) {
      this._terms.query = Session.get("searchQuery");
    }

    return [
      Meteor.subscribe('postsList', this._terms),
      Meteor.subscribe('postsListUsers', this._terms)
    ]
  },
  data: function () {
    var parameters = getParameters(this._terms),
        posts = Posts.find(parameters.find, parameters.options);
        postsCount = posts.count();
  
    Session.set('postsLimit', this._terms.limit);

    return {
      postsList: posts,
      postsCount: postsCount
    }
  },
  after: function() {
    var view = this.path == '/' ? 'top' : this.path.split('/')[1];
    Session.set('view', view);
  }    
});

// Controller for post digest

PostsDigestController = FastRender.RouteController.extend({
  template: 'posts_digest',
  waitOn: function() {
    // if day is set, use that. If not default to today
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : new Date(),
        terms = {
          view: 'digest',
          after: moment(currentDate).startOf('day').valueOf(),
          before: moment(currentDate).endOf('day').valueOf()
        }
    return [
      Meteor.subscribe('postsList', terms),
      Meteor.subscribe('postsListUsers', terms)
    ]
  },
  data: function() {
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : Session.get('today'),
        terms = {
          view: 'digest',
          after: moment(currentDate).startOf('day').valueOf(),
          before: moment(currentDate).endOf('day').valueOf()
        },
        parameters = getParameters(terms);
    Session.set('currentDate', currentDate);
    return {
      posts: Posts.find(parameters.find, parameters.options)
    }
  }
});

// Controller for post pages

PostPageController = FastRender.RouteController.extend({
  template: 'post_page',
  waitOn: function () {
    return [
      Meteor.subscribe('singlePost', this.params._id), 
      Meteor.subscribe('postComments', this.params._id),
      Meteor.subscribe('postUsers', this.params._id)
    ];
  },
  data: function () {
    return {postId: this.params._id};
  },
  after: function () {
    window.queueComments = false;
    window.openedComments = [];
    // TODO: scroll to comment position
  } 
});

// Controller for comment pages

CommentPageController = FastRender.RouteController.extend({
  waitOn: function() {
    return [
      Meteor.subscribe('singleComment', this.params._id),
      Meteor.subscribe('commentUser', this.params._id),
      Meteor.subscribe('commentPost', this.params._id)
    ]
  },
  data: function() {
    return {
      comment: Comments.findOne(this.params._id)
    }
  },
  after: function () {
    window.queueComments = false;
  } 
});

// Controller for user pages

UserPageController = FastRender.RouteController.extend({
  waitOn: function() {
    return Meteor.subscribe('singleUser', this.params._idOrSlug);
  },
  data: function() {
    var findById = Meteor.users.findOne(this.params._idOrSlug);
    var findBySlug = Meteor.users.findOne({slug: this.params._idOrSlug});
    if(typeof findById !== "undefined"){
      // redirect to slug-based URL
      Router.go(getProfileUrl(findById), {replaceState: true});
    }else{
      return {
        user: (typeof findById == "undefined") ? findBySlug : findById
      }
    }
  }
});

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Routes ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//

Router.map(function() {

  // -------------------------------------------- Post Lists -------------------------------------------- //

  // Top

  this.route('posts_top', {
    path: '/',
    controller: PostsListController
  });

  this.route('posts_top', {
    path: '/top/:limit?',
    controller: PostsListController
  });

  // New

  this.route('posts_new', {
    path: '/new/:limit?',
    controller: PostsListController
  });

  // Best

  this.route('posts_best', {
    path: '/best/:limit?',
    controller: PostsListController
  });

  // Pending

  this.route('posts_pending', {
    path: '/pending/:limit?',
    controller: PostsListController
  });

  // Categories

  this.route('posts_category', {
    path: '/category/:slug/:limit?',
    controller: PostsListController,
    after: function() {
      Session.set('categorySlug', this.params.slug);
    }
  });

  // TODO: enable /category/new, /category/best, etc. views

  // Search

  this.route('search', {
    path: '/search/:limit?',
    controller: PostsListController    
  });

  // Digest

  this.route('posts_digest', {
    path: '/digest/:year/:month/:day',
    controller: PostsDigestController
  });
  
  this.route('posts_digest', {
    path: '/digest',
    controller: PostsDigestController
  });

  // -------------------------------------------- Post -------------------------------------------- //


  // Post Page

  this.route('post_page', {
    path: '/posts/:_id',
    controller: PostPageController
  });

  this.route('post_page', {
    path: '/posts/:_id/comment/:commentId',
    controller: PostPageController,
    after: function () {
      // TODO: scroll to comment position
    }
  });

  // Post Edit

  this.route('post_edit', {
    path: '/posts/:_id/edit',
    waitOn: function () {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() {
      return {postId: this.params._id};
    },
    fastRender: true
  });

  // Post Submit

  this.route('post_submit', {path: '/submit'});

  // -------------------------------------------- Comment -------------------------------------------- //
  
  // Comment Page

  this.route('comment_page', {
    path: '/comments/:_id',
    controller: CommentPageController
  });

  // Comment Reply

  this.route('comment_reply', {
    path: '/comments/:_id/reply',
    controller: CommentPageController,
    after: function() {
      window.queueComments = false;
    }
  });

  // Comment Edit

  this.route('comment_edit', {
    path: '/comments/:_id/edit',
    controller: CommentPageController,
    after: function() {
      window.queueComments = false;
    }
  });

  // -------------------------------------------- Users -------------------------------------------- //

  // User Profile

  this.route('user_profile', {
    path: '/users/:_idOrSlug',
    controller: UserPageController
  });

  // User Edit

  this.route('user_edit', {
    path: '/users/:_idOrSlug/edit',
    controller: UserPageController
  });

  // Account

  this.route('account', {
    path: '/account',
    template: 'user_edit',
    data: function() {
      return {
        user: Meteor.user()
      }
    }
  });

  // Forgot Password

  this.route('forgot_password');

  // All Users

  this.route('all-users', {
    path: '/all-users/:limit?',
    template: 'users',
    waitOn: function() {
      var limit = parseInt(this.params.limit) || 20;
      return Meteor.subscribe('allUsers', this.params.filterBy, this.params.sortBy, limit);
    },
    data: function() {
      var limit = parseInt(this.params.limit) || 20,
          parameters = getUsersParameters(this.params.filterBy, this.params.sortBy, limit),
          filterBy = (typeof this.params.filterBy === 'string') ? this.params.filterBy : 'all',
          sortBy = (typeof this.params.sortBy === 'string') ? this.params.sortBy : 'createdAt';
      Session.set('usersLimit', limit);
      return {
        users: Meteor.users.find(parameters.find, parameters.options),
        filterBy: filterBy,
        sortBy: sortBy
      }
    },
    fastRender: true
  });

  // Unsubscribe (from notifications)

  this.route('unsubscribe', {
    path: '/unsubscribe/:hash',
    data: function() {
      return {
        hash: this.params.hash
      }
    }
  });

  // User Sign-Up

  this.route('signup');

  // User Sign-In

  this.route('signin');

  // -------------------------------------------- Other -------------------------------------------- //

  // Categories

  this.route('categories');

  // Settings

  this.route('settings');

  // Toolbox

  this.route('toolbox');

  // Search Logs

  this.route('logs', {
    path: '/logs/:limit?',
    waitOn: function () {
      var limit = this.params.limit || 100;
      if(Meteor.isClient) {
        Session.set('logsLimit', limit);
      }
      return Meteor.subscribe('searches', limit);
    },
    data: function () {
      return Searches.find({}, {sort: {timestamp: -1}});
    },
    fastRender: true
  });

  // -------------------------------------------- Server-Side -------------------------------------------- //

  this.route('api', {
    where: 'server',
    path: '/api',
    action: function() {
      this.response.write(serveAPI());
      this.response.end();
    }
  });

  this.route('apiWithParameter', {
    where: 'server',
    path: '/api/:limit',
    action: function() {
      this.response.write(serveAPI(this.params.limit));
      this.response.end();
    }
  });

  // RSS

  this.route('feed', {
    where: 'server',
    path: '/feed.xml',
    action: function() {
      this.response.write(serveRSS());
      this.response.end();
    }
  });

  // Link Out

  this.route('out', {
    where: 'server',
    path: '/out',
    action: function(){
      var query = this.request.query;
      if(query.url){
        var post = Posts.findOne({url: query.url});
        if(post){
          Posts.update({_id: post._id}, {$inc: {clicks: 1}});
        }
        this.response.writeHead(302, {'Location': query.url});
        this.response.end();
      }
    }
  });

});

// adding common subscriptions that's need to be loaded on all the routes
// notification does not included here since it is not much critical and 
// it might have considerable amount of docs
if(Meteor.isServer) {
  FastRender.onAllRoutes(function() {
    this.subscribe('categories');
    this.subscribe('settings');
    this.subscribe('currentUser');
  });
}
