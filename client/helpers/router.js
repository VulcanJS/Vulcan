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
  // autoRender: false,
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'not_found',
  before: function() {
    console.log('// Routing to '+Router._currentController.template)

    // reset all session variables that might be set by the previous route
    Session.set('categorySlug', null);

    // currentScroll stores the position of the user in the page
    Session.set('currentScroll', null);

    $('body').css('min-height','0');

    // set all errors who have already been seen to not show anymore
    clearSeenErrors();
        
    // log this request with mixpanel, etc
    analyticsRequest();
  }
});

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Filters --------------------------------------------//
//--------------------------------------------------------------------------------------------------//



var filters = {

  isLoggedIn: function() {
    if (Meteor.loggingIn()) {
      this.render('loading');
      this.stop(); 
    } else if (!Meteor.user()) {
      this.render('user_signin');
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
    if(!isAdmin(Meteor.user())){
      this.render('no_rights');
      this.stop();      
    }
  },

  canView: function() {
    if(!canView(Meteor.user())){
      this.render('no_rights');
      this.stop();
    }
  },

  canEditPost: function() {
    var post = Posts.findOne(this.params._id);
    if(!currentUserCanEdit(post)){
      this.render('no_rights');
      this.stop();
    }
  },

  canEditComment: function() {
    var comment = Comments.findOne(this.params._id);
    if(!currentUserCanEdit(comment)){
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

// TODO: enable filters with "only"

//   Meteor.Router.filter('requireProfile');
//   Meteor.Router.filter('requireLogin', {only: ['comment_reply','post_submit']});
//   Meteor.Router.filter('canView', {only: ['posts_top', 'posts_new', 'posts_digest', 'posts_best']});
//   Meteor.Router.filter('isLoggedOut', {only: ['user_signin', 'user_signup']});
//   Meteor.Router.filter('canPost', {only: ['posts_pending', 'comment_reply', 'post_submit']});
//   Meteor.Router.filter('canEdit', {only: ['post_edit', 'comment_edit']});
//   Meteor.Router.filter('requirePost', {only: ['post_page', 'post_edit']});
//   Meteor.Router.filter('isAdmin', {only: ['posts_pending', 'users', 'settings', 'categories', 'admin']});
//   Meteor.Router.filter('setRequestTimestamp', {only: ['post_page']});


//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Routes ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//

Router.map(function() {

  // TODO: put paginated subscriptions inside router

  // Top

  this.route('home', {
    path: '/',
    template:'posts_list',
    // waitOn: postListSubscription(selectPosts, sortPosts('score'), 11),
    after: function() {
      Session.set('view', 'top');
    }
  });

  this.route('posts_top', {
    path: '/top',
    template:'posts_list',
    // waitOn: postListSubscription(selectPosts, sortPosts('score'), 11),
    after: function() {
      Session.set('view', 'top');
    }
  });

  // New

  this.route('posts_new', {
    path: '/new',
    template:'posts_list',
    // waitOn: postListSubscription(selectPosts, sortPosts('submitted'), 12),
    after: function() {
      Session.set('view', 'new');
    }
  });

  // Best

  this.route('posts_best', {
    path: '/best',
    template:'posts_list',
    // waitOn: postListSubscription(selectPosts, sortPosts('baseScore'), 13),
    after: function() {
      Session.set('view', 'best');
    }
  });

  // Pending

  this.route('posts_pending', {
    path: '/pending',
    template:'posts_list',
    // waitOn: postListSubscription(function(){
    //   return selectPosts({status: STATUS_PENDING})
    // }, sortPosts('createdAt'), 14),
    after: function() {
      Session.set('view', 'pending');
    }
  });

  // Categories

  this.route('category', {
    path: '/c/:slug',
    template:'posts_list',
    // waitOn: postListSubscription(function(){
    //   // problem: :slug param is not accessible from here
    //   return selectPosts({status: STATUS_PENDING, slug: 'experiments'});
    // }, sortPosts('score'), 15)
    // waitOn: function(){
      // problem: infinite loading screen
    //   var slug = this.params.slug;
    //         console.log(slug)

    //   return postListSubscription(function(){
    //     return selectPosts({status: STATUS_PENDING, slug: slug});
    //   }, sortPosts('createdAt'), 14);
    // }
    after: function() {
      Session.set('view', 'category');
      Session.set('categorySlug', this.params.slug);
    }
  });

  // TODO: enable /category/new, /category/best, etc. views

  // this.route('category_view', {
  //   path: '/c/:slug/:view',
  // });

  // Digest

  this.route('posts_digest', {
    path: '/digest/:year/:month/:day',
    waitOn: function() {
      currentDate = new Date(this.params.year, this.params.month-1, this.params.day);
      Session.set('currentDate', currentDate);
      return Meteor.subscribe('postDigest', currentDate);
    },
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
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id), 
        Meteor.subscribe('comments', this.params._id),
        Meteor.subscribe('postUsers', this.params._id)
      ];
    },
    template: 'post_page',
    // before: function() {
    //   var postsHandle = Meteor.subscribe('singlePost', this.params._id);
    //   var commentsHandle = Meteor.subscribe('comments', { post : this.params._id })
    //   if(postsHandle.ready() && commentsHandle.ready()) {
    //     console.log('ready')
    //   } else {
    //     console.log('loading…')
    //     this.stop();
    //   }
    // },
    data: function() {
      // note: do not pass actual post object in data property because we don't want the route to be reactive
      // and re-run every time a post score changes
      return {
        postId: this.params._id
      }
    },
    after: function() {
      console.log('router after')
      window.queueComments = false;
    }
  });

  // Post Page (scroll to a comment)

  this.route('post_page_with_comment', {
    path: '/posts/:_id/comment/:_commentId',
    template: 'post_page',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id), 
        Meteor.subscribe('comments', this.params._id ),
        Meteor.subscribe('postUsers', this.params._id)
      ];
    },
    data: function() {
      return {
        postId: this.params._id
      }
    }
    // TODO: scroll window to specific comment
  });

  // Post Edit

  this.route('post_edit', {
    path: '/posts/:_id/edit',
    waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() {
      return {
        post: Posts.findOne(this.params._id)
      }
    },
    after: filters.canEditPost
  });

  // Post Submit

  this.route('post_submit', {path: '/submit'});

  // -------------------------------------------- Comment -------------------------------------------- //
  
  // Comment Page

  this.route('comment_page', {
    path: '/comments/:_id',
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
    data: function() {
      return {
        comment: Comments.findOne(this.params._id)
      }
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
    path: '/users/:_id',
    waitOn: function() {
      return Meteor.subscribe('singleUser', this.params._id);
    },
    data: function() {
      return {
        user: Meteor.users.findOne(this.params._id)
      }
    }
  });

  // User Edit

  this.route('user_edit', {
    path: '/users/:_id/edit',
    waitOn: function() {
      return Meteor.subscribe('singleUser', this.params._id);
    },
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

  this.route('users', {
    waitOn: function() {
      return Meteor.subscribe('allUsers');
    },
    data: function() {
      return {
        users: Meteor.users.find({}, {sort: {createdAt: -1}})
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
