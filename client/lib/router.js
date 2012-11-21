(function() {

  // XXX: could we just work this out programmatically based on the name?
  //   -- fix this along with the general problem of subscription mess
  PAGE_SUBS = {
    'posts_top': 'topPostsReady',
    'posts_new': 'newPostsReady',
    'posts_pending': 'pendingPostsReady',
    'posts_digest': 'digestPostsReady',
    'post_page': 'postReady',
    'post_edit': 'postReady',
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
    return 'posts_digest';
  };

  post = function(id, commentId) {
    Session.set('selectedPostId', id);
    if(typeof commentId !== 'undefined')
      Session.set('scrollToCommentId', commentId); 
  
    // XXX: should use the Session for these
    // on post page, we show the comment recursion
    window.repress_recursion=false;
    // reset the new comment time at each new request of the post page
    window.newCommentTimestamp=new Date();
  
    return 'post_page';
  };

  post_edit = function(id) {
    Session.set('selectedPostId', id); 
    return 'post_edit';
  };

  comment = function(id) {
    Session.set('selectedCommentId', id);
  
    // XXX: should use the Session for these
    window.repress_recursion=true;
    window.newCommentTimestamp=new Date();
  
    return 'comment_page';
  };

  comment_reply = function(id) {
    Session.set('selectedCommentId', id);

    // XXX: should use the Session for these
    window.repress_recursion=true;
    window.newCommentTimestamp=new Date();
  
    return 'comment_reply';
  };

  comment_edit = function(id) {
    Session.set('selectedCommentId', id);

    // XXX: should use the Session for these
    window.newCommentTimestamp=new Date();
  
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
    '/posts/:id/edit':'post_edit',
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
    startRequest: function(page){
      // runs at every new page change

      // openedComments is an Array that tracks which comments
      // have been expanded by the user, to make sure they stay expanded
      Session.set("openedComments", null);
      
      // currentScroll stores the position of the user in the page
      Session.set('currentScroll', null);
      
      document.title = getSetting("title");
      
      // set all errors who have already been seen to not show anymore
      clearSeenErrors();
          
      // log this request with mixpanel, etc
      instrumentRequest();
    
      return page;
    },

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
  
    awaitSubscription: function(page) {
      return Session.equals(PAGE_SUBS[page], true) ? page : 'loading';
    },
  
    // if the user is logged in but their profile isn't filled out enough
    requireProfile: function(page) {
      var user = Meteor.user();
      // XXX: this is out of date
      if (user && Meteor.userId() && ! userProfileComplete(user)){
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
  Meteor.Router.filter('startRequest'); // all
  Meteor.Router.filter('requireProfile');
  Meteor.Router.filter('awaitSubscription', {
    only: ['posts_top', 'posts_new', 'posts_pending', 'posts_digest']
  });
  Meteor.Router.filter('requireLogin', {
    only: ['post_submit']
  });
  Meteor.Router.filter('canView', {
    only: ['posts_top', 'posts_new', 'posts_digest']
  });
  Meteor.Router.filter('canPost', {only: 'posts_pending'});
  Meteor.Router.filter('requirePost', {only: ['post_page', 'post_edit']})
}());