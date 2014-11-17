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
Account
All Users
Unsubscribe (from notifications)

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

// uncomment to disable FastRender
var FastRender = {RouteController: RouteController, onAllRoutes: function() {}};

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Config ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//

preloadSubscriptions.push('settings');
preloadSubscriptions.push('currentUser');

Router.configure({
  layoutTemplate: getTemplate('layout'),
  loadingTemplate: getTemplate('loading'),
  notFoundTemplate: getTemplate('notFound'),
  waitOn: function () {
    return _.map(preloadSubscriptions, function(sub){
      // can either pass strings or objects with subName and subArguments properties
      if (typeof sub === 'object'){
        Meteor.subscribe(sub.subName, sub.subArguments);
      }else{
        Meteor.subscribe(sub);
      }
    });
  }
});

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
      throwError(i18n.t('Please Sign In First.'));
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
      throwError(i18n.t("Sorry, you don't have permissions to add new items."));
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
      throwError(i18n.t("Sorry, you cannot edit this post."));
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
      throwError(i18n.t("Sorry, you cannot edit this comment."));
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
  },

  setTitle: function() {
    // set title
    var title = getSetting("title");
    var tagline = getSetting("tagline");
    document.title = (tagline ? title+': '+tagline : title) || "";
  }

};

var filters = Router._filters;
var coreSubscriptions = new SubsManager({
  // cache recent 50 subscriptions
  cacheLimit: 50,
  // expire any subscription after 30 minutes
  expireIn: 30
});

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
  Router.onAfterAction(filters.setTitle);

  // Unload Hooks

  //

}

//--------------------------------------------------------------------------------------------------//
//------------------------------------------- Controllers ------------------------------------------//
//--------------------------------------------------------------------------------------------------//


// Controller for all posts lists

PostsListController = FastRender.RouteController.extend({
  template: getTemplate('posts_list'),
  subscriptions: function () {
    // take the first segment of the path to get the view, unless it's '/' in which case the view default to 'top'
    // note: most of the time this.params.slug will be empty
    this._terms = {
      view: this.view,
      limit: this.params.limit || getSetting('postsPerPage', 10),
      category: this.params.slug
    };

    if(Meteor.isClient) {
      this._terms.query = Session.get("searchQuery");
    }

    this.postsListSub = coreSubscriptions.subscribe('postsList', this._terms);
    this.postsListUsersSub = coreSubscriptions.subscribe('postsListUsers', this._terms);
  },
  data: function () {
    this._terms = {
      view: this.view,
      limit: this.params.limit || getSetting('postsPerPage', 10),
      category: this.params.slug
    };

    if(Meteor.isClient) {
      this._terms.query = Session.get("searchQuery");
    }

    var parameters = getPostsParameters(this._terms),
      postsCount = Posts.find(parameters.find, parameters.options).count();

    parameters.find.createdAt = { $lte: Session.get('listPopulatedAt') };
    var posts = Posts.find(parameters.find, parameters.options);
    
    // Incoming posts
    parameters.find.createdAt = { $gt: Session.get('listPopulatedAt') };
    var postsIncoming = Posts.find(parameters.find, parameters.options);

    Session.set('postsLimit', this._terms.limit);

    return {
      incoming: postsIncoming,
      postsList: posts,
      postsCount: postsCount,
      ready: this.postsListSub.ready
    };
  },
  onAfterAction: function() {
    Session.set('view', this.view);
  }
});

PostsTopController = PostsListController.extend({
  view: 'top'
});

PostsNewController = PostsListController.extend({
  view: 'new'
});

PostsBestController = PostsListController.extend({
  view: 'best'
});

PostsPendingController = PostsListController.extend({
  view: 'pending'
});

// Controller for post digest

PostsDigestController = FastRender.RouteController.extend({
  template: getTemplate('posts_digest'),
  waitOn: function() {
    // if day is set, use that. If not default to today
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : new Date(),
        terms = {
          view: 'digest',
          after: moment(currentDate).startOf('day').toDate(),
          before: moment(currentDate).endOf('day').toDate()
        };
    return [
      coreSubscriptions.subscribe('postsList', terms),
      coreSubscriptions.subscribe('postsListUsers', terms)
    ];
  },
  data: function() {
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : Session.get('today'),
        terms = {
          view: 'digest',
          after: moment(currentDate).startOf('day').toDate(),
          before: moment(currentDate).endOf('day').toDate()
        },
        parameters = getPostsParameters(terms);
    Session.set('currentDate', currentDate);

    parameters.find.createdAt = { $lte: Session.get('listPopulatedAt') };
    var posts = Posts.find(parameters.find, parameters.options);

    // Incoming posts
    parameters.find.createdAt = { $gt: Session.get('listPopulatedAt') };
    var postsIncoming = Posts.find(parameters.find, parameters.options);

    return {
      incoming: postsIncoming,
      posts: posts
    };
  }
});

// Controller for post pages

PostPageController = FastRender.RouteController.extend({
  
  template: getTemplate('post_page'),

  waitOn: function() {
    this.postSubscription = coreSubscriptions.subscribe('singlePost', this.params._id);
    this.postUsersSubscription = coreSubscriptions.subscribe('postUsers', this.params._id);
    this.commentSubscription = coreSubscriptions.subscribe('postComments', this.params._id);
  },

  post: function() {
    return Posts.findOne(this.params._id);
  },

  onBeforeAction: function() {
    if (! this.post()) {
      if (this.postSubscription.ready()) {
        this.render(getTemplate('not_found'));
      } else {
        this.render(getTemplate('loading'));
      }
    } else {
      this.next();
    }
  },

  data: function() {
    return this.post();
  }
});


// Controller for comment pages

CommentPageController = FastRender.RouteController.extend({
  waitOn: function() {
    return [
      coreSubscriptions.subscribe('singleComment', this.params._id),
      coreSubscriptions.subscribe('commentUser', this.params._id),
      coreSubscriptions.subscribe('commentPost', this.params._id)
    ];
  },
  data: function() {
    return {
      comment: Comments.findOne(this.params._id)
    };
  },
  onAfterAction: function () {
    window.queueComments = false;
  }
});

// Controller for user pages

UserPageController = FastRender.RouteController.extend({
  waitOn: function() {
    return [
      coreSubscriptions.subscribe('userProfile', this.params._idOrSlug)
    ]
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
      };
    }
  }
});

// Controller for user account editing

AccountController = FastRender.RouteController.extend({
  waitOn: function() {
    return coreSubscriptions.subscribe('invites');
  },
  data: function() {
    return {
      user : Meteor.user(),
      invites: Invites.find({invitingUserId:Meteor.userId()})
    };
  }
});

var getDefaultViewController = function () {
  var defaultView = getSetting('defaultView', 'top');
  defaultView = defaultView.charAt(0).toUpperCase() + defaultView.slice(1);
  return eval("Posts"+defaultView+"Controller");
};

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Routes ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//
Meteor.startup(function () {

  // -------------------------------------------- Post Lists -------------------------------------------- //

  Router.route('/', {
    name: 'posts_default',
    controller: getDefaultViewController()
  });

  Router.route('/top/:limit?', {
    name: 'posts_top',
    controller: PostsTopController
  });

  // New

  Router.route('/new/:limit?', {
    name: 'posts_new',
    controller: PostsNewController
  });

  // Best

  Router.route('/best/:limit?', {
    name: 'posts_best',
    controller: PostsBestController
  });

  // Pending

  Router.route('/pending/:limit?', {
    name: 'posts_pending',
    controller: PostsPendingController
  });



  // TODO: enable /category/new, /category/best, etc. views


  // Digest

  Router.route('/digest/:year/:month/:day', {
    name: 'posts_digest',
    controller: PostsDigestController
  });

  Router.route('/digest', {
    name: 'posts_digest_default',
    controller: PostsDigestController
  });

  // -------------------------------------------- Post -------------------------------------------- //


  // Post Page

  Router.route('/posts/:_id', {
    name: 'post_page',
    controller: PostPageController
  });

  Router.route('/posts/:_id/comment/:commentId', {
    name: 'post_page_comment',
    controller: PostPageController,
    onAfterAction: function () {
      // TODO: scroll to comment position
    }
  });

  // Post Edit

  Router.route('/posts/:_id/edit', {
    name: 'post_edit',
    template: getTemplate('post_edit'),
    waitOn: function () {
      return [
        coreSubscriptions.subscribe('singlePost', this.params._id),
        coreSubscriptions.subscribe('allUsersAdmin')
      ];
    },
    data: function() {
      return {
        postId: this.params._id,
        post: Posts.findOne(this.params._id)
      };
    },
    fastRender: true
  });

  // Post Submit

  Router.route('/submit', {
    name: 'post_submit',
    template: getTemplate('post_submit'),
  });

  // -------------------------------------------- Comment -------------------------------------------- //

  // Comment Reply

  Router.route('/comments/:_id', {
    name: 'comment_reply',
    template: getTemplate('comment_reply'),
    controller: CommentPageController,
    onAfterAction: function() {
      window.queueComments = false;
    }
  });

  // Comment Edit

  Router.route('/comments/:_id/edit', {
    name: 'comment_edit',
    template: getTemplate('comment_edit'),
    controller: CommentPageController,
    onAfterAction: function() {
      window.queueComments = false;
    }
  });

  // -------------------------------------------- Users -------------------------------------------- //

  // User Logout

  Router.route('/sign-out', {
    name: 'signOut',
    onBeforeAction: function() {
      Meteor.logout(function() {
        return Router.go('/');
      });
    }
  });

  // User Profile

  Router.route('/users/:_idOrSlug', {
    name: 'user_profile',
    template: getTemplate('user_profile'),
    controller: UserPageController
  });

  // User Edit

  Router.route('/users/:_idOrSlug/edit', {
    name: 'user_edit',
    template: getTemplate('user_edit'),
    controller: UserPageController
  });

  // Account

  Router.route('/account', {
    name: 'account',
    template: getTemplate('user_edit'),
    controller: AccountController
  });

  // All Users

  Router.route('/all-users/:limit?', {
    name: 'all-users',
    template: getTemplate('users'),
    waitOn: function() {
      var limit = parseInt(this.params.limit) || 20;
      return coreSubscriptions.subscribe('allUsers', this.params.filterBy, this.params.sortBy, limit);
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
      };
    },
    fastRender: true
  });

  // Unsubscribe (from notifications)

  Router.route('/unsubscribe/:hash', {
    name: 'unsubscribe',
    template: getTemplate('unsubscribe'),
    data: function() {
      return {
        hash: this.params.hash
      };
    }
  });

  // -------------------------------------------- Other -------------------------------------------- //



  // Settings

  Router.route('/settings', {
    name: 'settings',
    template: getTemplate('settings'),
    data: function () {
      // we only have one set of settings for now
      return {
        hasSettings: !!Settings.find().count(),
        settings: Settings.findOne()
      }
    }
  });

 // Loading (for testing purposes)

  Router.route('/loading', {
    name: 'loading',
    template: getTemplate('loading')
  });

  // Toolbox

  Router.route('/toolbox', {
    name: 'toolbox',
    template: getTemplate('toolbox')
  });

  // -------------------------------------------- Server-Side -------------------------------------------- //

  // Link Out

  Router.route('/out', {
    name: 'out',
    where: 'server',
    action: function(){
      var query = this.request.query;
      if(query.url){
        var decodedUrl = decodeURIComponent(query.url);
        var post = Posts.findOne({url: decodedUrl});
        if(post){
          Posts.update(post._id, {$inc: {clicks: 1}});
        }
        this.response.writeHead(302, {'Location': query.url});
        this.response.end();
      }
    }
  });

  // Notification email

  Router.route('/email/notification/:id?', {
    name: 'notification',
    where: 'server',
    action: function() {
      var notification = Notifications.findOne(this.params.id);
      var notificationContents = buildEmailNotification(notification);
      this.response.write(notificationContents.html);
      this.response.end();
    }
  });

  // New user email

  Router.route('/email/new-user/:id?', {
    name: 'newUser',
    where: 'server',
    action: function() {
      var user = Meteor.users.findOne(this.params.id);
      var emailProperties = {
        profileUrl: getProfileUrl(user),
        username: getUserName(user)
      };
    console.log(Handlebars);

      console.log(Handlebars.templates);

      html = getEmailTemplate('emailNewUser')(emailProperties);
      this.response.write(buildEmailTemplate(html));
      this.response.end();
    }
  });

  // New post email

  Router.route('/email/new-post/:id?', {
    name: 'newPost',
    where: 'server',
    action: function() {
      var post = Posts.findOne(this.params.id);
      html = Handlebars.templates[getTemplate('emailNewPost')](getPostProperties(post));
      this.response.write(buildEmailTemplate(html));
      this.response.end();
    }
  });

  // Account approved email

  Router.route('/email/account-approved/:id?', {
    name: 'accountApproved',
    where: 'server',
    action: function() {
      var user = Meteor.users.findOne(this.params.id);
      var emailProperties = {
        profileUrl: getProfileUrl(user),
        username: getUserName(user),
        siteTitle: getSetting('title'),
        siteUrl: getSiteUrl()
      };
      html = Handlebars.templates[getTemplate('emailAccountApproved')](emailProperties);
      this.response.write(buildEmailTemplate(html));
      this.response.end();
    }
  });
});

// adding common subscriptions that's need to be loaded on all the routes
// notification does not included here since it is not much critical and
// it might have considerable amount of docs
if(Meteor.isServer) {
  FastRender.onAllRoutes(function() {
    var router = this;
    _.each(preloadSubscriptions, function(sub){
      router.subscribe(sub);
    });
  });
}
