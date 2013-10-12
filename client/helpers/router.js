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
  notFoundTemplate: 'not_found'
});

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Filters --------------------------------------------//
//--------------------------------------------------------------------------------------------------//



var filters = {
  
  // isLoggedIn: function(page) {
  //   if (Meteor.loggingIn()) {
  //     return 'loading';
  //   } else if (Meteor.user()) {
  //     return page;
  //   } else {
  //     return 'user_signin';
  //   }
  // },

  // isLoggedOut: function(page){
  //   return Meteor.user() ? "already_logged_in" : page;
  // },

  // isAdmin: function(page) {
  //   return isAdmin(Meteor.user()) ? page : "no_rights";
  // },

  // canView: function(page) {
  //   var error = canView(Meteor.user(), true);
  //   if (error === true)
  //     return page;
    
  //   // a problem.. make sure we are logged in
  //   if (Meteor.loggingIn())
  //     return 'loading';
    
  //   // otherwise the error tells us what to show.
  //   return error;
  // },

  // canPost: function(page) {
  //   var error = canPost(Meteor.user(), true);
  //   if (error === true)
  //     return page;
    
  //   // a problem.. make sure we are logged in
  //   if (Meteor.loggingIn())
  //     return 'loading';
    
  //   // otherwise the error tells us what to show.
  //   return error;
  // },

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
  }
//   canEditX: function(page) {
//     // make findOne() non reactive to avoid re-triggering the router every time the 
//     // current comment or post object changes
//     // but make sure the comment/post is loaded before moving on
//     if (page === 'comment_edit') {
//       var item = Comments.findOne(Session.get('selectedCommentId'), {reactive: false});
//       if(!Session.get('singleCommentReady'))
//         return 'loading'
//     } else {
//       var item = Posts.findOne(Session.get('selectedPostId'), {reactive: false});
//       if(!Session.get('singlePostReady'))
//         return 'loading'
//     }

//     var error = canEdit(Meteor.user(), item, true);
//     if (error === true)
//       return page;
    
//     // a problem.. make sure the item has loaded and we have logged in
//     if (! item || Meteor.loggingIn())
//       return 'loading';

//     // otherwise the error tells us what to show.
//     return error;
//   },

//   hasCompletedProfile: function() {
//     var user = Meteor.user();

//     if (user && ! Meteor.loggingIn() && ! userProfileComplete(user)){
//       Session.set('selectedUserId', user._id);
//       return 'user_email';
//     } else {
//       return page;
//     }
//   }

}

//--------------------------------------------------------------------------------------------------//
//------------------------------------- Subscription Functions -------------------------------------//
//--------------------------------------------------------------------------------------------------//

postsSubscriptions = {};
currentSubscription = {};

// Posts Lists
STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

var selectTop = function() {
  return selectPosts({name: 'top', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}

var selectNew = function() {
  return selectPosts({name: 'new', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}

var selectBest = function() {
  return selectPosts({name: 'best', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}

var selectPending = function() {
  return selectPosts({name: 'pending', status: STATUS_PENDING, slug: Session.get('categorySlug')});
}

// put it all together with pagination
var postListSubscription = function(find, options, per_page) {
  var handle = Meteor.subscribeWithPagination('paginatedPosts', find, options, per_page);
  handle.fetch = function() {
    var ourFind = _.isFunction(find) ? find() : find;
    return limitDocuments(Posts.find(ourFind, options), handle.loaded());
  }
  return handle;
}

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Routes ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//

Router.map(function() {

  // Top

  this.route('home', {
    path: '/',
    template:'posts_list',
    waitOn: postListSubscription(selectTop, sortPosts('score'), 11),
    after: function() {
      Session.set('view', 'top');
    }
  });

  this.route('posts_top', {
    path: '/top',
    template:'posts_list',
    waitOn: postListSubscription(selectTop, sortPosts('score'), 11),
    after: function() {
      Session.set('view', 'top');
    }
  });

  // New

  this.route('posts_new', {
    path: '/new',
    template:'posts_list',
    waitOn: postListSubscription(selectNew, sortPosts('submitted'), 12),
    after: function() {
      Session.set('view', 'new');
    }
  });

  // Best

  this.route('posts_best', {
    path: '/best',
    template:'posts_list',
    waitOn: postListSubscription(selectBest, sortPosts('baseScore'), 13),
    after: function() {
      Session.set('view', 'best');
    }
  });

  // Pending

  this.route('posts_pending', {
    path: '/pending',
    template:'posts_list',
    waitOn: postListSubscription(selectPending, sortPosts('createdAt'), 14),
    after: function() {
      Session.set('view', 'pending');
    }
  });

  // Categories

  this.route('category', {
    path: '/c/:slug',
    template:'posts_list',
    waitOn: function() {
      Session.set('view', 'top');
      Session.set('categorySlug', this.params.slug);
      return postListSubscription(selectTop, sortPosts('score'), 10)
    }
  });

  // this.route('category_view', {
  //   path: '/c/:slug/:view',
  //   waitOn: function() {
  //     Session.set('view', this.params.view);
  //     Session.set('categorySlug', this.params.slug);
  //     return postListSubscription(selectTop, sortPosts('score'), 10),
  //   },
  //   before: function() {

  //     Router._categoryFilter = true;
  //   }
  // });
  // TODO
  
  //   category = function(categorySlug, view){
//     var view = (typeof view === 'undefined') ? 'top' : view;
//     console.log('setting category slug to: '+categorySlug)
//     Session.set('categorySlug', categorySlug);
//     Meteor.Router.categoryFilter = true;
//     return 'posts_'+view;
//   }
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
        Meteor.subscribe('comments', { post : this.params._id })
      ];
    },
    data: function() {
      return {
        post: Posts.findOne(this.params._id)
      }
    }
  });

  // Post Page (scroll to a comment)

  this.route('post_page_with_comment', {
    path: '/posts/:_id/comment/:_commentId',
    template: 'post_page',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id), 
        Meteor.subscribe('comments', { post : this.params._id })
      ];
    },
    data: function() {
      return {
        post: Posts.findOne(this.params._id)
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
      return Meteor.subscribe('comments', this.params._id);
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

  // Categories

  this.route('categories');

  // Settings

  this.route('settings');

  // Toolbox

  this.route('toolbox');

});


// (function() {  
//   Meteor.Router.beforeRouting = function() {
//     console.log('// Before Routing //')
//     // reset all session variables that might be set by the previous route
//     Session.set('categorySlug', null);

//     // currentScroll stores the position of the user in the page
//     Session.set('currentScroll', null);
    
//     var tagline = getSetting("tagline") ? ": "+getSetting("tagline") : '';
//     document.title = getSetting("title")+tagline;
    
//     $('body').css('min-height','0');

//     // set all errors who have already been seen to not show anymore
//     clearSeenErrors();
        
//     // log this request with mixpanel, etc
//     analyticsRequest();
//   }
  
//   // specific router functions
//   digest = function(year, month, day, view){
//     var destination = (typeof view === 'undefined') ? 'posts_digest' : 'posts_digest_'+view
//     if (typeof day === 'undefined') {
//       // we can get into an infinite reactive loop with the subscription filter
//       // if we keep setting the date even when it's barely changed
//       // if (new Date() - new Date(Session.get('currentDate')) > 60 * 1000) {
//         Session.set('currentDate', new Date());
//       // }
//       // Session.set('currentDate', new Date());
//     } else {
//       Session.set('currentDate', new Date(year, month-1, day));
//     }
    
//     // we need to make sure that the session changes above have been executed 
//     // before we can look at the digest handle. XXX: this might be a bad idea
//     // Meteor.flush();
//     // if (!digestHandle() || digestHandle().loading()) {
//     //   return 'loading';
//     // } else {
//       return destination;
//     // }
//   };

//   post = function(id, commentId) {
//     Session.set('selectedPostId', id);
//     if(typeof commentId !== 'undefined')
//       Session.set('scrollToCommentId', commentId); 
  
//     // on post page, we show the comment tree
//     Session.set('showChildComments',true);
//     return 'post_page';
//   };

//   post_edit = function(id) {
//     Session.set('selectedPostId', id); 
//     return 'post_edit';
//   };

//   comment = function(id) {
//     Session.set('selectedCommentId', id);
//     return 'comment_page';
//   };

//   comment_reply = function(id) {
//     Session.set('selectedCommentId', id);
//     return 'comment_reply';
//   };

//   comment_edit = function(id) {
//     Session.set('selectedCommentId', id);  
//     return 'comment_edit';
//   };

//   // XXX: do these two really not want to set it to undefined (or null)?
//   user_profile = function(id) {
//     if(typeof id !== undefined){
//       Session.set('selectedUserId', id);
//     }
//     return 'user_profile';
//   };

//   user_edit = function(id) {
//     if(typeof id !== undefined){
//       Session.set('selectedUserId', id);
//     }
//     return 'user_edit';
//   };

//   unsubscribe = function(hash){
//     Session.set('userEmailHash', hash);
//     return 'unsubscribe';
//   }

//   category = function(categorySlug, view){
//     var view = (typeof view === 'undefined') ? 'top' : view;
//     console.log('setting category slug to: '+categorySlug)
//     Session.set('categorySlug', categorySlug);
//     Meteor.Router.categoryFilter = true;
//     return 'posts_'+view;
//   }

//   // XXX: not sure if the '/' trailing routes are needed any more
//   Meteor.Router.add({
//     '/': 'posts_top',
//     '/top':'posts_top',
//     '/top/:page':'posts_top',
//     '/new':'posts_new',
//     '/new/:page':'posts_new',
//     '/best':'posts_best',
//     '/pending':'posts_pending',
//     '/digest/:year/:month/:day': digest,
//     '/digest': digest,
//     '/c/:category_slug/:view': category,
//     '/c/:category_slug': category,
//     '/signin':'user_signin',
//     '/signup':'user_signup',
//     '/submit':'post_submit',
//     '/invite':'no_invite',
//     '/posts/deleted':'post_deleted',
//     '/posts/:id/edit': post_edit,
//     '/posts/:id/comment/:comment_id': post,
//     '/posts/:id': post,
//     '/comments/deleted':'comment_deleted',   
//     '/comments/:id': comment,
//     '/comments/:id/reply': comment_reply,
//     '/comments/:id/edit': comment_edit,
//     '/settings':'settings',
//     '/toolbox':'toolbox',
//     '/categories':'categories',
//     '/users':'users',
//     '/account':'user_edit',
//     '/forgot_password':'user_password',
//     '/users/:id': user_profile,
//     '/users/:id/edit': user_edit,
//     '/:year/:month/:day': digest,
//     '/unsubscribe/:hash': unsubscribe
// });


//   Meteor.Router.filters({

//     setRequestTimestamp: function(page){
//       // openedComments is an Array that tracks which comments
//       // have been expanded by the user, to make sure they stay expanded
//       Session.set("openedComments", null);
//       Session.set('requestTimestamp',new Date());
//       // console.log('---------------setting request timestamp: '+Session.get('requestTimestamp'))
//       return page;
//     },

//     requireLogin: function(page) {
//       if (Meteor.loggingIn()) {
//         return 'loading';
//       } else if (Meteor.user()) {
//         return page;
//       } else {
//         return 'user_signin';
//       }
//     },
    
//     canView: function(page) {
//       var error = canView(Meteor.user(), true);
//       if (error === true)
//         return page;
      
//       // a problem.. make sure we are logged in
//       if (Meteor.loggingIn())
//         return 'loading';
      
//       // otherwise the error tells us what to show.
//       return error;
//     },
  
//     canPost: function(page) {
//       var error = canPost(Meteor.user(), true);
//       if (error === true)
//         return page;
      
//       // a problem.. make sure we are logged in
//       if (Meteor.loggingIn())
//         return 'loading';
      
//       // otherwise the error tells us what to show.
//       return error;
//     },
    
//     canEdit: function(page) {
//       // make findOne() non reactive to avoid re-triggering the router every time the 
//       // current comment or post object changes
//       // but make sure the comment/post is loaded before moving on
//       if (page === 'comment_edit') {
//         var item = Comments.findOne(Session.get('selectedCommentId'), {reactive: false});
//         if(!Session.get('singleCommentReady'))
//           return 'loading'
//       } else {
//         var item = Posts.findOne(Session.get('selectedPostId'), {reactive: false});
//         if(!Session.get('singlePostReady'))
//           return 'loading'
//       }

//       var error = canEdit(Meteor.user(), item, true);
//       if (error === true){
//         return page;

//       }
      
//       // a problem.. make sure the item has loaded and we have logged in
//       if (! item || Meteor.loggingIn()){
//         return 'loading';
//       }

//       // otherwise the error tells us what to show.
//       return error;
//     },
  
//     isLoggedOut: function(page){
//       return Meteor.user() ? "already_logged_in" : page;
//     },

//     isAdmin: function(page) {
//       return isAdmin(Meteor.user()) ? page : "no_rights";
//     },

//     // if the user is logged in but their profile isn't filled out enough
//     requireProfile: function(page) {
//       var user = Meteor.user();

//       if (user && ! Meteor.loggingIn() && ! userProfileComplete(user)){
//         Session.set('selectedUserId', user._id);
//         return 'user_email';
//       } else {
//         return page;
//       }
//     },
  
//     // if we are on a page that requires a post, as set in selectedPostId
//     requirePost: function(page) {
//       // make findOne() non reactive to avoid re-triggering the router every time the 
//       // current comment or post object changes
//       if (Posts.findOne(Session.get('selectedPostId'), {reactive: false})) {
//         return page;
//       } else if (! Session.get('singlePostReady')) {
//         return 'loading';
//       } else {
//         return 'not_found';
//       }
//     }
//   });
//   //
//   Meteor.Router.filter('requireProfile');
//   Meteor.Router.filter('requireLogin', {only: ['comment_reply','post_submit']});
//   Meteor.Router.filter('canView', {only: ['posts_top', 'posts_new', 'posts_digest', 'posts_best']});
//   Meteor.Router.filter('isLoggedOut', {only: ['user_signin', 'user_signup']});
//   Meteor.Router.filter('canPost', {only: ['posts_pending', 'comment_reply', 'post_submit']});
//   Meteor.Router.filter('canEdit', {only: ['post_edit', 'comment_edit']});
//   Meteor.Router.filter('requirePost', {only: ['post_page', 'post_edit']});
//   Meteor.Router.filter('isAdmin', {only: ['posts_pending', 'users', 'settings', 'categories', 'admin']});
//   Meteor.Router.filter('setRequestTimestamp', {only: ['post_page']});

//   Meteor.startup(function() {
//     Meteor.autorun(function() {
//       // grab the current page from the router, so this re-runs every time it changes
//       Meteor.Router.page();
//       if(Meteor.Router.page() !== "loading"){
//         console.log('------ '+Meteor.Router.page()+' ------');
      
//         // note: posts_digest doesn't use paginated subscriptions so it cannot have a rank
//         if(_.contains(['posts_top', 'posts_new', 'posts_pending', 'posts_best'], Meteor.Router.page())){
//           Session.set('isPostsList', true);
//         }else{
//           Session.set('isPostsList', false);
//         }

//       }
//     });    
//   });
// }());