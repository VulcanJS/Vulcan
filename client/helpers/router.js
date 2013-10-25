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
#                    Subscription Functions                   #
---------------------------------------------------------------

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



*/


//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Config ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//


Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'not_found',
});

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Filters --------------------------------------------//
//--------------------------------------------------------------------------------------------------//

var filters = {

  nProgressHook: function () {
    // console.log('// nProgress Hook')
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
      throwError('Please Sign In First.')
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
    if(!Meteor.loggingIn() && Session.get('settingsLoaded') && !isAdmin()){
      throwError("Sorry, you  have to be an admin to view this page.")
      this.render('no_rights');
      this.stop(); 
    }
  },

  canView: function() {
    if(Session.get('settingsLoaded') && !canView()){
      this.render('no_rights');
      this.stop();
    }
  },

  canPost: function () {
    if(!canPost()){
      throwError("Sorry, you don't have permissions to add new items.")
      this.render('no_rights');
      this.stop();      
    }
  },

  canEditPost: function() {
    var post = Posts.findOne(this.params._id);
    if(!currentUserCanEdit(post)){
      throwError("Sorry, you cannot edit this post.")
      this.render('no_rights');
      this.stop();
    }
  },

  canEditComment: function() {
    var comment = Comments.findOne(this.params._id);
    if(!currentUserCanEdit(comment)){
      throwError("Sorry, you cannot edit this comment.")
      this.render('no_rights');
      this.stop();
    }
  },

  hasCompletedProfile: function() {
    var user = Meteor.user();
    if (user && ! Meteor.loggingIn() && ! userProfileComplete(user)){
      // Session.set('selectedUserId', user._id);
      this.render('user_email');
      this.stop();
    }
  }

}

// Load Hooks

Router.load( function () {
  analyticsRequest(); // log this request with mixpanel, etc
  clearSeenErrors(); // set all errors who have already been seen to not show anymore
  Session.set('categorySlug', null); 
});

// Before Hooks

Router.before(filters.hasCompletedProfile);
Router.before(filters.isLoggedIn, {only: ['comment_reply','post_submit']});
Router.before(filters.canView);
Router.before(filters.isLoggedOut, {only: ['signin', 'signup']});
Router.before(filters.canPost, {only: ['posts_pending', 'comment_reply', 'post_submit']});
Router.before(filters.canEditPost, {only: ['post_edit']});
Router.before(filters.canEditComment, {only: ['comment_edit']});
Router.before(filters.isAdmin, {only: ['posts_pending', 'all-users', 'settings', 'categories', 'toolbox']});

// After Hooks

Router.after(filters.resetScroll, {except:['posts_top', 'posts_new', 'posts_best', 'posts_pending', 'category', 'all-users']});

// Unload Hooks

//

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Routes ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//

getParameters = function (view, limit, category) {

  var baseParameters = {
    find: {
      status: 2
    },
    options: {
      limit: 10
    }
  }

  // TODO: find a way to guarantee order of parameters, or else switch back to old syntax

  switch (view) {

    case 'top':
      var parameters = $.extend(true, baseParameters, {options: {sort: {sticky: -1, score: -1}}});
      break;

    case 'new':
      var parameters = $.extend(true, baseParameters, {options: {sort: {sticky: -1, submitted: -1}}});
      break;

    case 'best':
      var parameters = $.extend(true, baseParameters, {options: {sort: {sticky: -1, baseScore: -1}}});
      break;

    case 'pending':
      var parameters = $.extend(true, baseParameters, {find: {status: 1}, options: {sort: {baseScore: -1}}});
      break;      

    case 'category': // same as top for now
      var parameters = $.extend(true, baseParameters, {options: {sort: {sticky: -1, score: -1}}});
      break;

  }

  // sort by _id to break ties
  $.extend(true, parameters, {options: {sort: {_id: -1}}})

  if(typeof limit != 'undefined')
    _.extend(parameters.options, {limit: parseInt(limit)});

  if(typeof category != 'undefined')
    _.extend(parameters.find, {'categories.slug': category});

  // console.log(parameters.options.sort)

  return parameters;
}

// Common controller for all posts lists

PostsListController = RouteController.extend({
  template:'posts_list',
  // waitOn: postListSubscription(selectPosts, sortPosts('baseScore'), 13),
  waitOn: function () {
    var view = this.path == '/' ? 'top' : this.path.split('/')[1];
    var limit = this.params.limit || getSetting('postsPerPage', 10);
    var parameters = getParameters(view, limit);
    return [
      Meteor.subscribe('postsList', parameters.find, parameters.options),
      Meteor.subscribe('postsListUsers', parameters.find, parameters.options)
    ]
  },
  data: function () {
    var view = this.path == '/' ? 'top' : this.path.split('/')[1];
    var limit = this.params.limit || getSetting('postsPerPage', 10);
    var parameters = getParameters(view, limit);
    Session.set('postsLimit', limit);
    return {
      posts: Posts.find(parameters.find, parameters.options)
    }
  },
  before: filters.nProgressHook,
  after: function() {
    Session.set('view', 'top');
  }    
});

Router.map(function() {

  // TODO: put paginated subscriptions inside router

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

  // category route uses slightly different hooks, so don't inherit from PostListController for now

  this.route('category', {
    path: '/category/:slug/:limit?',
    // controller: PostsListController,
    template:'posts_list',
    waitOn: function () {
      var limit = this.params.limit || getSetting('postsPerPage', 10);
      var parameters = getParameters('category', limit, this.params.slug);
      return [
        Meteor.subscribe('postsList', parameters.find, parameters.options),
        Meteor.subscribe('postsListUsers', parameters.find, parameters.options)
      ]
    },
    data: function () {
      var limit = this.params.limit || getSetting('postsPerPage', 10);
      var parameters = getParameters('category', limit, this.params.slug);
      Session.set('postsLimit', limit);
      return {
        posts: Posts.find(parameters.find, parameters.options)
      }
    },
    before: filters.nProgressHook,
    after: function() {
      Session.set('view', 'category');
      Session.set('categorySlug', this.params.slug);
    }
  });

  // TODO: enable /category/new, /category/best, etc. views


  // Digest

  this.route('posts_digest', {
    path: '/digest/:year/:month/:day',
    waitOn: function() {
      currentDate = new Date(this.params.year, this.params.month-1, this.params.day);
      Session.set('currentDate', currentDate);
      return Meteor.subscribe('postDigest', currentDate);
    },
    before: filters.nProgressHook,
    data: function() {
      return {
        posts: findDigestPosts(moment(currentDate))
      }
    }
  });
  
  this.route('posts_digest_shortcut', {
    path: '/digest',
    template: 'posts_digest',
    waitOn: function() {
      // note: this runs twice for some reason? is 'today' changing?
      currentDate = Session.get('today');
      Session.set('currentDate', currentDate);
      return Meteor.subscribe('postDigest', currentDate);
    },
    before: filters.nProgressHook,
    data: function() {
      return {
        posts: findDigestPosts(moment(currentDate))
      }
    }
  });

  // -------------------------------------------- Post -------------------------------------------- //


  // Post Page

  this.route('post_page', {
    path: '/posts/:_id',
    waitOn: function () {
        return [
          Meteor.subscribe('singlePost', this.params._id), 
          Meteor.subscribe('comments', this.params._id),
          Meteor.subscribe('postUsers', this.params._id)
        ];
    },
    before: filters.nProgressHook,
    data: function () {
      return {postId: this.params._id};
    },
    after: function () {
      window.queueComments = false;
      window.openedComments = [];
      // TODO: scroll to comment position
    }
  });

  this.route('post_page', {
    path: '/posts/:_id/comment/:commentId',
    waitOn: function () {
        // console.log('// Subscription Hook')
        this.subscribe('singlePost', this.params._id).wait(), 
        this.subscribe('comments', this.params._id).wait(),
        this.subscribe('postUsers', this.params._id).wait()
    },
    before: filters.nProgressHook,
    data: function () {
      return {postId: this.params._id};
    },
    after: function () {
      window.queueComments = false;
      window.openedComments = [];
      // TODO: scroll to comment position
    }
  });

  // Post Edit

  this.route('post_edit', {
    path: '/posts/:_id/edit',
    waitOn: function () {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    before: filters.nProgressHook,
    data: function() {
      return {postId: this.params._id};
    }
    // after: filters.canEditPost
  });

  // Post Submit

  this.route('post_submit', {path: '/submit'});

  // -------------------------------------------- Comment -------------------------------------------- //
  
  // Comment Page

  this.route('comment_page', {
    path: '/comments/:_id',
    waitOn: function() {
      return Meteor.subscribe('singleComment', this.params._id);
    },    
    data: function() {
      return {
        comment: Comments.findOne(this.params._id)
      }
    }
  });

  // Comment Reply

  this.route('comment_reply', {
    path: '/comments/:_id/reply',
    waitOn: function() {
      return Meteor.subscribe('singleComment', this.params._id);
    },
    before: filters.nProgressHook,
    data: function() {
      return {
        comment: Comments.findOne(this.params._id)
      }
    },
    after: function() {
      window.queueComments = false;
    }
  });

  // Comment Edit

  this.route('comment_edit', {
    path: '/comments/:_id/edit',
    data: function() {
      return {
        comment: Comments.findOne(this.params._id)
      }
    },
    after: filters.canEditComment
  });

  // -------------------------------------------- Users -------------------------------------------- //

  // User Profile

  this.route('user_profile', {
    path: '/users/:_idOrSlug',
    waitOn: function() {
      return Meteor.subscribe('singleUser', this.params._idOrSlug);
    },
    before: filters.nProgressHook,
    data: function() {
      var findById = Meteor.users.findOne(this.params._idOrSlug);
      var findBySlug = Meteor.users.findOne({slug: this.params._idOrSlug});
      return {
        user: (typeof findById == "undefined") ? findBySlug : findById
      }
    }
  });

  // User Edit

  this.route('user_edit', {
    path: '/users/:_id/edit',
    waitOn: function() {
      return Meteor.subscribe('singleUser', this.params._id);
    },
    before: filters.nProgressHook,
    data: function() {
      return {
        user: Meteor.users.findOne(this.params._id)
      }
    }
  });

  // Forgot Password

  this.route('forgot_password');

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

  // All Users

  this.route('all-users', {
    path: '/all-users/:limit?',
    template: 'users',
    waitOn: function() {
      var limit = parseInt(this.params.limit) || 20;
      return Meteor.subscribe('allUsers', limit);
    },
    before: filters.nProgressHook,
    data: function() {
      var limit = parseInt(this.params.limit) || 20;
      Session.set('usersLimit', limit);
      return {
        users: Meteor.users.find({}, {sort: {createdAt: -1}, limit: limit})
      }
    }
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

});
