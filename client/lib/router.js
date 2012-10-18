SimpleRouter = FilteredRouter.extend({
  initialize: function() {
    FilteredRouter.prototype.initialize.call(this);
    this.filter(this.require_login, {only: ['submit']});
    this.filter(this.start_request);
    this.filter(this.require_profile);
    this.filter(this.requirePost, {only: ['post_page']});
  },
  start_request: function(page){
    // runs at every new page change

    Session.set("openedComments", null);
    document.title = getSetting("title");

    // set all errors who have been seen to not show anymore
    clearSeenErrors();
    
    // log this request with mixpanel, etc
    instrumentRequest();
    
    return page;
  },
  require_login: function(page) {
    if (Meteor.user()) {
      return page;
    } else {
      return 'signin';
    }
  },
  
  // if the user is logged in but their profile isn't filled out enough
  require_profile: function(page) {
    var user = Meteor.user();
    if (user && ! user.loading && ! userProfileComplete(user)){
      Session.set('selectedUserId', user._id);
      return 'user_email';
    } else {
      return page;
    }
  },
  
  // if we are on a page that requires a post, as set in selectedPostId
  requirePost: function(page) {
    if (Posts.findOne(Session.get('selectedPostId'))) {
      return 'post_page';
    } else if (! Session.get('postReady')) {
      return 'loading';
    } else {
      return 'not_found';
    }
  },
  
  routes: {
    '': 'top',
    'top':'top',
    'top/':'top',
    'top/:page':'top',
    'new':'new',
    'new/':'new',
    'new/:page':'new',
    'digest/:year/:month/:day':'digest',
    'digest':'digest',
    'digest/':'digest',
    'test':'test',
    'signin':'signin',
    'signup':'signup',
    'submit':'submit',
    'invite':'invite',
    'posts/deleted':'post_deleted',
    'posts/:id/edit':'post_edit',
    'posts/:id/comment/:comment_id':'post',
    'posts/:id':'post',
    'comments/deleted':'comment_deleted',   
    'comments/:id':'comment',
    'comments/:id/reply':'comment_reply',
    'comments/:id/edit':'comment_edit',
    'settings':'settings',
    'admin':'admin',
    'categories':'categories',
    'users':'users',
    'account':'user_edit',
    'forgot_password':'forgot_password',
    'users/:id': 'user_profile',
    'users/:id/edit':'user_edit'
  },
  top: function(page) {
    if(canView(Meteor.user(), 'replace')) {
      var pageNumber = (typeof page === 'undefined') ? 1 : page;
      var postsPerPage=1;
      var postsView={
        find: {},
        sort: {score: -1},
        skip: (pageNumber-1)*postsPerPage,
        limit: postsPerPage,
        postsPerPage: postsPerPage,
        page: pageNumber
      }
      sessionSetObject('postsView', postsView);
      this.goto('posts_top');
    }
  },
  new: function(page) {
    if(canView(Meteor.user(), 'replace')) {
      var pageNumber = (typeof page === 'undefined') ? 1 : page;
      var postsPerPage=10;
      var postsView={
        find: {},
        sort: {submitted: -1},
        postsPerPage: postsPerPage,
        skip:(pageNumber-1)*postsPerPage,
        limit: postsPerPage,
        page: pageNumber
      }
      sessionSetObject('postsView', postsView);
      this.goto('posts_new');
    }
  },
  digest: function(year, month, day){
    if(canView(Meteor.user(), 'replace')) {
      if(typeof day === 'undefined'){
        // if day is not defined, just use today
        // and change the URL to today's date
        var date = new Date();
        var mDate = moment(date);
        this.navigate(getDigestURL(mDate));
      }else{
        var date=new Date(year, month-1, day);
        var mDate = moment(date);
      }
      sessionSetObject('currentDate', date);
      var postsPerPage=5;
      var postsView={
        find: {submitted: {$gte: mDate.startOf('day').valueOf(), $lt: mDate.endOf('day').valueOf()}},
        sort: {score: -1},
        skip:0,
        postsPerPage: postsPerPage,
        limit: postsPerPage
      }
      sessionSetObject('postsView', postsView);
      this.goto('posts_digest');
    }   
  },
  signup: function() { this.goto('signup'); },
  signin: function() { this.goto('signin'); },
  invite: function() { this.goto('no_invite'); },
  submit: function() { this.goto('post_submit'); },
  settings: function() { this.goto('settings'); },
  users: function() { this.goto('users'); },
  post_deleted: function() { this.goto('post_deleted'); },
  comment_deleted: function() { this.goto('comment_deleted'); },
  forgot_password: function() { this.goto('user_password'); },
  admin: function() { this.goto('admin'); },
  categories: function() { this.goto('categories'); },
  post: function(id, commentId) {
    Session.set('selectedPostId', id);
    if(typeof commentId !== 'undefined')
      Session.set('scrollToCommentId', commentId); 
    
    this.goto('post_page');
    
    // on post page, we show the comment recursion
    window.repress_recursion=false;
    // reset the new comment time at each new request of the post page
    window.newCommentTimestamp=new Date();
  },
  post_edit: function(id) {
    Session.set('selectedPostId', id); 
    this.goto('post_edit'); 
  },
  comment: function(id) {
    Session.set('selectedCommentId', id);
    window.repress_recursion=true;
    window.newCommentTimestamp=new Date();
    this.goto('comment_page');    
  },
  comment_reply: function(id) {
    Session.set('selectedCommentId', id);
    window.repress_recursion=true;
    window.newCommentTimestamp=new Date();
    this.goto('comment_reply');
  },
  comment_edit: function(id) {
    Session.set('selectedCommentId', id);
    window.newCommentTimestamp=new Date();
    this.goto('comment_edit');
  },
  user_profile: function(id){
    if(typeof id !== undefined){
      Session.set('selectedUserId', id);
    }
    this.goto('user_profile');
  },
  user_edit: function(id){
    if(typeof id !== undefined){
      Session.set('selectedUserId', id);
    }
    this.goto('user_edit');
  }
});
  
var Router = new SimpleRouter();
Meteor.startup(function() {
});