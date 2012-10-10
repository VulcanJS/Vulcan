SimpleRouter = FilteredRouter.extend({
  initialize: function() {
    FilteredRouter.prototype.initialize.call(this);
    this.filter(this.require_login, {only: ['submit']});
    this.filter(this.start_request);
    this.filter(this.require_profile);
  },
  start_request: function(page){
    // runs at every new page change

    Session.set("openedComments", null);
    document.title = getSetting("title");

    // set all errors who have been seen to not show anymore
    clearSeenErrors();

    // Mixpanel

    if((mixpanelId=getSetting("mixpanelId")) && window.mixpanel.length==0){
      mixpanel.init(mixpanelId);
      if(Meteor.user()){
        var currentUserEmail=getCurrentUserEmail();
        mixpanel.people.identify(currentUserEmail);
        mixpanel.people.set({
            'username': getDisplayName(Meteor.user()),
            '$last_login': new Date(), 
            '$created': moment(Meteor.user().createdAt)._d,
            '$email': currentUserEmail
        });
        mixpanel.register({
            'username': getDisplayName(Meteor.user()),
            'createdAt': moment(Meteor.user().createdAt)._d,
            'email': currentUserEmail
        });
        mixpanel.name_tag(currentUserEmail);
      }
    }

    // GoSquared

      if((goSquaredId=getSetting("goSquaredId"))){
      GoSquared.acct = goSquaredId;
      GoSquaredInit();
    }

    // Intercom
    if((intercomId=getSetting("intercomId")) && Meteor.user()){
      window.intercomSettings = {
        app_id: intercomId,
        email: currentUserEmail,
        created_at: moment(Meteor.user().createdAt).unix(),
        custom_data: {
          'profile link': 'http://'+document.domain+'/users/'+Meteor.user()._id
        },
        widget: {
          activator: '#Intercom',
          use_counter: true,
          activator_html: function ( obj ) {
            return obj.activator_html_functions.brackets();
          }
        }
      };
      IntercomInit();
    }

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
  if  (user && !user.loading && !userProfileComplete(user))
    return 'user_email';
  else
    return page;
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
      var page = (typeof page === 'undefined') ? 1 : page;
      Session.set('currentPageNumber', page);
      this.goto('posts_top');
    }
  },
  new: function(page) {
    if(canView(Meteor.user(), 'replace')) {
      var page = (typeof page === 'undefined') ? 1 : page;
      Session.set('currentPageNumber', page);
      this.goto('posts_new');
    }
  },
  digest: function(year, month, day){

    if(canView(Meteor.user(), 'replace')) {
      var page = (typeof page === 'undefined') ? 1 : page;
      Session.set('currentPageNumber', page);
      if(typeof day === 'undefined'){
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
    console.log("post, id="+id+', commentId='+commentId); 
    window.template='post_page'; 
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
    console.log("post_edit, id="+id);
    window.template='post_edit';
    Session.set('selectedPostId', id); 
    this.goto('post_edit'); 
  },
  comment: function(id) {
    console.log("comment, id="+id);
    Session.set('selectedCommentId', id);
    this.goto('comment_page');
    window.repress_recursion=true;
    window.newCommentTimestamp=new Date();
  },
  comment_reply: function(id) {
    console.log("comment reply, id="+id);
    window.template='comment_reply';
    Session.set('selectedCommentId', id);
    this.goto('comment_reply');
    window.repress_recursion=true;
    window.newCommentTimestamp=new Date();
  },
  comment_edit: function(id) {
    console.log("comment_edit, id="+id);
    window.template='comment_edit'; 
    Session.set('selectedCommentId', id);
    this.goto('comment_edit');
    window.newCommentTimestamp=new Date();
  },
  user_profile: function(id){
    if(typeof id !== undefined){
      window.selectedUserId=id;
    }
    this.goto('user_profile');
  },
  user_edit: function(id){
    if(typeof id !== undefined){
      window.selectedUserId=id;
    }
    this.goto('user_edit');
  }
});
  
var Router = new SimpleRouter();
Meteor.startup(function() {
});