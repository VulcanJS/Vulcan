var getDefaultViewController = function () {
  var defaultView = getSetting('defaultView', 'top');
  defaultView = defaultView.charAt(0).toUpperCase() + defaultView.slice(1);
  return eval("Posts"+defaultView+"Controller");
};

// Controller for all posts lists

PostsListController = RouteController.extend({

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
      postsCursor: posts,
      postsCount: postsCount,
      postsReady: this.postsListSub.ready(),
      hasMorePosts: this._terms.limit == postsCount,
      loadMoreHandler: function () {

        var count = parseInt(Session.get('postsLimit')) + parseInt(getSetting('postsPerPage', 10));
        var categorySegment = Session.get('categorySlug') ? Session.get('categorySlug') + '/' : '';

        // TODO: use Router.path here?
        Router.go('/' + Session.get('view') + '/' + categorySegment + count);
      }
    };
  },

  getTitle: function () {
    return i18n.t(this.view) + ' - ' + getSetting('title', "Telescope");
  },

  getDescription: function () {
    if (Router.current().route.getName() == 'posts_default') { // return site description on root path
      return getSetting('description');
    } else {
      return i18n.t(_.findWhere(viewsMenu, {label: this.view}).description);
    }
  },

  onAfterAction: function() {
    Session.set('view', this.view);
  },

  fastRender: true
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

PostsScheduledController = PostsListController.extend({
  view: 'scheduled'
});

// Controller for post pages

PostPageController = RouteController.extend({

  template: getTemplate('post_page'),

  waitOn: function() {
    this.postSubscription = coreSubscriptions.subscribe('singlePost', this.params._id);
    this.postUsersSubscription = coreSubscriptions.subscribe('postUsers', this.params._id);
    this.commentSubscription = coreSubscriptions.subscribe('postComments', this.params._id);
  },

  post: function() {
    return Posts.findOne(this.params._id);
  },

  getTitle: function () {
    if (!!this.post())
      return this.post().title + ' - ' + getSetting('title', "Telescope");
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

  onRun: function() {
    var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
    Meteor.call('increasePostViews', this.params._id, sessionId);
    this.next();
  },

  data: function() {
    return this.post();
  },
  fastRender: true
});

Meteor.startup(function () {

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

  // Scheduled

  Router.route('/scheduled/:limit?', {
    name: 'posts_scheduled',
    controller: PostsScheduledController
  });

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
    waitOn: function () {
      return coreSubscriptions.subscribe('allUsersAdmin');
    }
  });

});