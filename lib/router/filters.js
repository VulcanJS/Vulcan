//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Filters --------------------------------------------//
//--------------------------------------------------------------------------------------------------//

Router._filters = {

  isReady: function() {
    if (!this.ready()) {
      // console.log('not ready')
      this.render(getTemplate('loading'));
    }else{
      this.next();
      // console.log('ready')
    }
  },

  clearSeenErrors: function () {
    clearSeenErrors();
    this.next();
  },

  resetScroll: function () {
    var scrollTo = window.currentScroll || 0;
    var $body = $('body');
    $body.scrollTop(scrollTo);
    $body.css("min-height", 0);
  },

  /*
  isLoggedIn: function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      throwError(i18n.t('please_sign_in_first'));
      var current = getCurrentRoute();
      if (current){
        Session.set('fromWhere', current);
      }
      this.render('entrySignIn');
    } else {
      this.next();
    }
  },
  */
  isLoggedIn: AccountsTemplates.ensureSignedIn,

  isLoggedOut: function() {
    if(Meteor.user()){
      this.render('already_logged_in');
    } else {
      this.next();
    }
  },

  isAdmin: function() {
    if(!this.ready()) return;
    if(!isAdmin()){
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canView: function() {
    if(!this.ready() || Meteor.loggingIn()){
      this.render(getTemplate('loading'));
    } else if (!canView()) {
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canPost: function () {
    if(!this.ready() || Meteor.loggingIn()){
      this.render(getTemplate('loading'));
    } else if(!canPost()) {
      throwError(i18n.t("sorry_you_dont_have_permissions_to_add_new_items"));
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canEditPost: function() {
    if(!this.ready()) return;
    // Already subscribed to this post by route({waitOn: ...})
    var post = Posts.findOne(this.params._id);
    if(!currentUserCanEdit(post)){
      throwError(i18n.t("sorry_you_cannot_edit_this_post"));
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canEditComment: function() {
    if(!this.ready()) return;
    // Already subscribed to this comment by CommentPageController
    var comment = Comments.findOne(this.params._id);
    if(!currentUserCanEdit(comment)){
      throwError(i18n.t("sorry_you_cannot_edit_this_comment"));
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  hasCompletedProfile: function() {
    if(!this.ready()) return;
    var user = Meteor.user();
    if (user && ! userProfileComplete(user)){
      this.render(getTemplate('user_email'));
    } else {
      this.next();
    }
  }
};

filters = Router._filters;
coreSubscriptions = new SubsManager({
  // cache recent 50 subscriptions
  cacheLimit: 50,
  // expire any subscription after 30 minutes
  expireIn: 30
});

Meteor.startup( function (){

  if(Meteor.isClient){

    // Load Hooks

    Router.onRun( function () {
      Session.set('categorySlug', null);

      // if we're not on the search page itself, clear search query and field
      if(getCurrentRoute().indexOf('search') == -1){
        Session.set('searchQuery', '');
        $('.search-field').val('').blur();
      }

      this.next();

    });

    // Before Hooks

    Router.onBeforeAction(filters.isReady);
    Router.onBeforeAction(filters.clearSeenErrors);
    Router.onBeforeAction(filters.canView, {except: ['atSignIn', 'atSignUp', 'atForgotPwd', 'atResetPwd', 'signOut']});
    Router.onBeforeAction(filters.hasCompletedProfile);
    Router.onBeforeAction(filters.isLoggedIn, {only: ['post_submit']});
    Router.onBeforeAction(filters.isLoggedOut, {only: []});
    Router.onBeforeAction(filters.canPost, {only: ['posts_pending', 'post_submit']});
    Router.onBeforeAction(filters.canEditPost, {only: ['post_edit']});
    Router.onBeforeAction(filters.canEditComment, {only: ['comment_edit']});
    Router.onBeforeAction(filters.isAdmin, {only: ['posts_pending', 'all-users', 'settings', 'toolbox', 'logs']});

    // After Hooks

    // Router.onAfterAction(filters.resetScroll, {except:['posts_top', 'posts_new', 'posts_best', 'posts_pending', 'posts_category', 'all-users']});
    Router.onAfterAction(analyticsInit); // will only run once thanks to _.once()
    Router.onAfterAction(analyticsRequest); // log this request with mixpanel, etc

    // Unload Hooks

    //

  }

});
