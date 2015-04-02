//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Filters --------------------------------------------//
//--------------------------------------------------------------------------------------------------//

Router._filters = {

  isReady: function () {
    if (!this.ready()) {
      // console.log('not ready')
      this.render(getTemplate('loading'));
    }else{
      this.next();
      // console.log('ready')
    }
  },

  clearSeenMessages: function () {
    Messages.clearSeen();
    this.next();
  },

  resetScroll: function () {
    var scrollTo = window.currentScroll || 0;
    var $body = $('body');
    $body.scrollTop(scrollTo);
    $body.css("min-height", 0);
  },

  /*
  isLoggedIn: function () {
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

  isLoggedOut: function () {
    if(Meteor.user()){
      this.render('already_logged_in');
    } else {
      this.next();
    }
  },

  isAdmin: function () {
    if(!this.ready()) return;
    if(!isAdmin()){
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canView: function () {
    if(!this.ready() || Meteor.loggingIn()){
      this.render(getTemplate('loading'));
    } else if (!can.view()) {
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canViewPendingPosts: function () {
    var post = this.data();
    if (!!post && post.status == STATUS_PENDING && !can.viewPendingPosts()) {
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canViewRejectedPosts: function () {
    var post = this.data();
    if (!!post && post.status == STATUS_REJECTED && !can.viewRejectedPosts()) {
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canPost: function () {
    if(!this.ready() || Meteor.loggingIn()){
      this.render(getTemplate('loading'));
    } else if(!can.post()) {
      Messages.flash(i18n.t("sorry_you_dont_have_permissions_to_add_new_items"), "error");
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canEditPost: function () {
    if(!this.ready()) return;
    // Already subscribed to this post by route({waitOn: ...})
    var post = Posts.findOne(this.params._id);
    if(!can.currentUserEdit(post)){
      Messages.flash(i18n.t("sorry_you_cannot_edit_this_post"), "error");
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  canEditComment: function () {
    if(!this.ready()) return;
    // Already subscribed to this comment by CommentPageController
    var comment = Comments.findOne(this.params._id);
    if(!can.currentUserEdit(comment)){
      Messages.flash(i18n.t("sorry_you_cannot_edit_this_comment"), "error");
      this.render(getTemplate('no_rights'));
    } else {
      this.next();
    }
  },

  hasCompletedProfile: function () {
    if(!this.ready()) return;
    var user = Meteor.user();
    if (user && ! userProfileComplete(user)){
      this.render(getTemplate('user_email'));
    } else {
      this.next();
    }
  },

  setSEOProperties: function () {

    var props = {meta: {}, og: {}};
    var title = this.getTitle && this.getTitle();
    var description = this.getDescription && this.getDescription();
    var image = getSetting("siteImage");

    if (!!title) {
      props.title = title + " | " + getSetting("title");
    }
    if (!!description) {
      props.meta.description = description;
      props.og.description = description;
    }
    if (!!image) {
      props.og.image = image;
    }

    SEO.set(props);

  },

  setCanonical: function () {
    // note: disabled for now because the code below erases the page title

    // var post = Posts.findOne(this.params._id);
    // if (post) {
    //   SEO.set({link: {canonical: getPostPageUrl(post)}});
    // }
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

    Router.onBeforeAction( function () {
      Session.set('categorySlug', null);

      // if we're not on the search page itself, clear search query and field
      if(Router.current().route.getName() !== 'search'){
        Session.set('searchQuery', '');
        $('.search-field').val('').blur();
      }

      this.next();

    });

    // onRun Hooks

    // note: this has to run in an onRun hook, because onBeforeAction hooks can get called multiple times
    // per route, which would erase the message before the user has actually seen it
    // TODO: find a way to make this work even with HCRs.
    Router.onRun(filters.clearSeenMessages);

    // Before Hooks

    Router.onBeforeAction(filters.isReady);
    Router.onBeforeAction(filters.canView, {except: ['atSignIn', 'atSignUp', 'atForgotPwd', 'atResetPwd', 'signOut']});
    Router.onBeforeAction(filters.canViewPendingPosts, {only: ['post_page']});
    Router.onBeforeAction(filters.canViewRejectedPosts, {only: ['post_page']});
    Router.onBeforeAction(filters.hasCompletedProfile);
    Router.onBeforeAction(filters.isLoggedOut, {only: []});
    Router.onBeforeAction(filters.canPost, {only: ['posts_pending', 'post_submit']});
    Router.onBeforeAction(filters.canEditPost, {only: ['post_edit']});
    Router.onBeforeAction(filters.canEditComment, {only: ['comment_edit']});
    Router.onBeforeAction(filters.isAdmin, {only: ['posts_pending', 'all-users', 'settings', 'toolbox', 'logs']});

    Router.plugin('ensureSignedIn', {only: ['post_submit', 'post_edit', 'comment_edit']});

    // After Hooks

    // Router.onAfterAction(filters.resetScroll, {except:['posts_top', 'posts_new', 'posts_best', 'posts_pending', 'posts_category', 'all-users']});
    Router.onAfterAction(analyticsInit); // will only run once thanks to _.once()
    Router.onAfterAction(analyticsRequest); // log this request with mixpanel, etc
    Router.onAfterAction(filters.setSEOProperties);
    Router.onAfterAction(filters.setCanonical, {only: ["post_page", "post_page_with_slug"]});

    // Unload Hooks

    //

  }

});
