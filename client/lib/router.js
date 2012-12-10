(function() {

  // XXX: could we just work this out programmatically based on the name?
  //   -- fix this along with the general problem of subscription mess
  PAGE_SUBS = {
    'posts_top': 'topPostsReady',
    'posts_new': 'newPostsReady',
    'posts_best': 'bestPostsReady',
    'posts_pending': 'pendingPostsReady',
    'posts_digest': 'digestPostsReady',
    'post_page': 'singlePostReady',
    'post_edit': 'singlePostReady',
    'comment_page': 'commentReady',
    'comment_reply': 'commentReady',
    'comment_edit': 'commentReady'
  }
  
  // specific router functions
  digest = function(year, month, day){
    if (typeof day === 'undefined') {
      // we can get into an infinite reactive loop with the subscription filter
      // if we keep setting the date even when it's barely changed
      if (new Date() - Session.get('currentDate') > 60 * 1000) {
        Session.set('currentDate', new Date());
      }
    } else {
      Session.set('currentDate', new Date(year, month-1, day));
    }
    
    // a manual version of awaitSubscription; the sub can be loading
    // with a new day, but the data is already there (as the subscription is 
    // for three days)
    if (postsForSub.digestPosts().length === 0 && Session.equals(PAGE_SUBS['post_digest'], false)) {
      return 'loading'
    } else {
      return 'posts_digest';
    }
  };

  post = function(id, commentId) {
    Session.set('selectedPostId', id);
    if(typeof commentId !== 'undefined')
      Session.set('scrollToCommentId', commentId); 
  
    // XXX: should use the Session for these
    // on post page, we show the comment tree
    Session.set('showChildComments',true);

    return 'post_page';
  };

  post_edit = function(id) {
    Session.set('selectedPostId', id); 
    return 'post_edit';
  };

  comment = function(id) {
    Session.set('selectedCommentId', id);
    return 'comment_page';
  };

  comment_reply = function(id) {
    Session.set('selectedCommentId', id);
    return 'comment_reply';
  };

  comment_edit = function(id) {
    Session.set('selectedCommentId', id);  
    return 'comment_edit';
  };

  // XXX: do these two really not want to set it to undefined (or null)?
  user_profile = function(id) {
    if(typeof id !== undefined){
      Session.set('selectedUserId', id);
    }
    return 'user_profile';
  };

  user_edit = function(id) {
    if(typeof id !== undefined){
      Session.set('selectedUserId', id);
    }
    return 'user_edit';
  };

  // XXX: not sure if the '/' trailing routes are needed any more
  Meteor.Router.add({
    '/': 'posts_top',
    '/top':'posts_top',
    '/top/':'posts_top',
    '/top/:page':'posts_top',
    '/new':'posts_new',
    '/new/':'posts_new',
    '/new/:page':'posts_new',
    '/best':'posts_best',
    '/best/':'posts_best',
    '/pending':'posts_pending',
    '/digest/:year/:month/:day': digest,
    '/digest': digest,
    '/digest/': digest,
    '/test':'test',
    '/signin':'user_signin',
    '/signup':'user_signup',
    '/submit':'post_submit',
    '/invite':'no_invite',
    '/posts/deleted':'post_deleted',
    '/posts/:id/edit':post_edit,
    '/posts/:id/comment/:comment_id':post,
    '/posts/:id/':post,
    '/posts/:id':post,
    '/comments/deleted':'comment_deleted',   
    '/comments/:id':comment,
    '/comments/:id/reply':comment_reply,
    '/comments/:id/edit':comment_edit,
    '/settings':'settings',
    '/admin':'admin',
    '/categories':'categories',
    '/users':'users',
    '/account':'user_edit',
    '/forgot_password':'user_password',
    '/users/:id': user_profile,
    '/users/:id/edit':user_edit,
    '/:year/:month/:day':digest,
  });


  Meteor.Router.filters({
    requireLogin: function(page) {
      if (Meteor.loggingIn()) {
        return 'loading';
      } else if (Meteor.user()) {
        return page;
      } else {
        return 'user_signin';
      }
    },
    
    canView: function(page) {
      var error = canView(Meteor.user(), true);
      if (error === true)
        return page;
      
      // a problem.. make sure we are logged in
      if (Meteor.loggingIn())
        return 'loading';
      
      // otherwise the error tells us what to show.
      return error;
    },
  
    canPost: function(page) {
      var error = canPost(Meteor.user(), true);
      if (error === true)
        return page;
      
      // a problem.. make sure we are logged in
      if (Meteor.loggingIn())
        return 'loading';
      
      // otherwise the error tells us what to show.
      return error;
    },
    
    canEdit: function(page) {
      if (page === 'comment_edit') {
        var item = Comments.findOne(Session.get('selectedCommentId'));
      } else {
        var item = Posts.findOne(Session.get('selectedPostId'));
      }
      
      var error = canEdit(Meteor.user(), item, true);
      if (error === true)
        return page;
      
      // a problem.. make sure the item has loaded and we have logged in
      if (! item || Meteor.loggingIn())
        return 'loading';
      
      // otherwise the error tells us what to show.
      return error;
    },
  
    isLoggedOut: function(page){
      return Meteor.user() ? "already_logged_in" : page;
    },

    isAdmin: function(page) {
      return isAdmin(Meteor.user()) ? page : "no_rights";
    },

    awaitSubscription: function(page) {
      return Session.equals(PAGE_SUBS[page], true) ? page : 'loading';
    },
  
    // if the user is logged in but their profile isn't filled out enough
    requireProfile: function(page) {
      var user = Meteor.user();

      if (user && ! Meteor.loggingIn() && ! userProfileComplete(user)){
        Session.set('selectedUserId', user._id);
        return 'user_email';
      } else {
        return page;
      }
    },
  
    // if we are on a page that requires a post, as set in selectedPostId
    requirePost: function(page) {
      if (Posts.findOne(Session.get('selectedPostId'))) {
        return page;
      } else if (! Session.get('postReady')) {
        return 'loading';
      } else {
        return 'not_found';
      }
    }
  });
  // 
  Meteor.Router.filter('requireProfile');
  Meteor.Router.filter('awaitSubscription', {only: ['posts_top', 'posts_new', 'posts_pending', 'posts_best']});
  Meteor.Router.filter('requireLogin', {only: ['comment_reply','post_submit']});
  Meteor.Router.filter('canView', {only: ['posts_top', 'posts_new', 'posts_digest', 'posts_best']});
  Meteor.Router.filter('isLoggedOut', {only: ['user_signin', 'user_signup']});
  Meteor.Router.filter('canPost', {only: ['posts_pending', 'comment_reply', 'post_submit']});
  Meteor.Router.filter('canEdit', {only: ['post_edit', 'comment_edit']});
  Meteor.Router.filter('requirePost', {only: ['post_page', 'post_edit']});
  Meteor.Router.filter('isAdmin', {only: ['posts_pending', 'users', 'settings', 'categories', 'admin']});
  
  Meteor.startup(function() {
    Meteor.autorun(function() {
      // grab the current page from the router, so this re-runs every time it changes
      Meteor.Router.page();
      console.log('------ Request start --------');
    
      // openedComments is an Array that tracks which comments
      // have been expanded by the user, to make sure they stay expanded
      Session.set("openedComments", null);
      Session.set('requestTimestamp',new Date());

      // currentScroll stores the position of the user in the page
      Session.set('currentScroll', null);
      
      document.title = getSetting("title");
      
      // $('body').css('min-height','0');

      // set all errors who have already been seen to not show anymore
      clearSeenErrors();
          
      // log this request with mixpanel, etc
      analyticsRequest();    

      // if there are any pending events, log them too
      if(eventBuffer=Session.get('eventBuffer')){
        _.each(eventBuffer, function(e){
          console.log('in buffer: ', e);
          trackEvent(e.event, e.properties);
        });
      }
    });    
  });
}());