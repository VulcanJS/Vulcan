/**
 * The Posts.controllers namespace
 * @namespace Posts.controllers
 */
Posts.controllers = {};

/**
 * Controller for all posts lists
 */
Posts.controllers.list = RouteController.extend({

  template: "posts_list_controller",

  showViewsNav: true,

  data: function () {

    var terms = {
      view: this.view,
      limit: this.params.limit || Settings.get('postsPerPage', 10),
      enableCache: true
    };

    // console.log('----------------- router running');

    // note: the post list controller template will handle all subscriptions, so we just need to pass in the terms
    return {
      terms: terms
    };
  },

  getTitle: function () {
    return i18n.t(this.view);
  },

  getDescription: function () {
    if (Router.current().route.getName() === 'posts_default') { // return site description on root path
      return Settings.get('description');
    } else {
      return i18n.t(_.findWhere(Telescope.menuItems.get("viewsMenu"), {label: this.view}).description);
    }
  }

});

var getDefaultViewController = function () {
  var defaultView = Settings.get('defaultView', 'top');
  // if view we got from settings is available in Posts.views object, use it
  if (!!Posts.controllers[defaultView]) {
    return Posts.controllers[defaultView];
  } else {
    return Posts.controllers.top;
  }
};

// wrap in startup block to make sure Settings collection is defined
Meteor.startup(function () {
  Posts.controllers.default = getDefaultViewController().extend({
    getTitle: function () {
      var title = Settings.get('title', 'Telescope');
      var tagline = Settings.get('tagline');
      var fullTitle = !!tagline ? title + ' – ' + tagline : title ;
      return fullTitle;
    }
  });
});

/**
 * Controller for top view
 */
Posts.controllers.top = Posts.controllers.list.extend({
  view: 'top'
});

/**
 * Controller for new view
 */
Posts.controllers.new = Posts.controllers.list.extend({
  view: 'new'
});

/**
 * Controller for best view
 */
Posts.controllers.best = Posts.controllers.list.extend({
  view: 'best'
});

/**
 * Controller for pending view
 */
Posts.controllers.pending = Posts.controllers.list.extend({
  view: 'pending'
});

/**
 * Controller for scheduled view
 */
Posts.controllers.scheduled = Posts.controllers.list.extend({
  view: 'scheduled'
});

/**
 * Controller for single post page
 */
Posts.controllers.page = RouteController.extend({

  template: 'post_page',

  subscriptions: function () {
    this.postSubscription = Telescope.subsManager.subscribe('singlePost', this.params._id);
    this.postUsersSubscription = Telescope.subsManager.subscribe('postUsers', this.params._id);
    this.commentSubscription = Telescope.subsManager.subscribe('commentsList', {view: 'postComments', postId: this.params._id});
  },

  post: function() {
    return Posts.findOne(this.params._id);
  },

  getTitle: function () {
    if (!!this.post())
      return this.post().title;
  },

  onBeforeAction: function () {
    if (!this.post()) {
      if (this.postSubscription.ready()) {
        this.render('not_found');
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
    return {post: this.post()};
  },

  onAfterAction: function () {
    var post = this.post();

    // Replace URL
    if (post) {
      if (post.slug !== this.params.slug) {
        window.history.replaceState({}, "", post.getPageUrl());
      }
      $('link[rel="canonical"]').attr("href", post.getPageUrl(true));
    }

    // Set SEO properties
    
    var props = {meta: {}, og: {}, twitter: {}};

    // Set site name
    props.og.site_name = Settings.get("title");

    // Set title
    props.title = post.title;

    // Set description
    if (!!post.body) {
      var description = Telescope.utils.trimWords(post.body, 100);
      props.meta.description = description;
      props.og.description = description;
    }

    // Set image
    if (!!post.thumbnailUrl) {
      var image = Telescope.utils.addHttp(post.thumbnailUrl);
      props.meta.image = image;
      props.og.image = image;
      props.twitter.image = image;
      props.twitter.card = "summary_large_image";
    }

    // Set Twitter username
    if (!!Settings.get("twitterAccount")) {
      props.twitter.site = Settings.get("twitterAccount");
    }
    
    SEO.set(props);

    $('title').text(post.title);

  },

  fastRender: true
});

Meteor.startup(function () {

  Router.route('/', {
    name: 'posts_default',
    controller: Posts.controllers.default
  });

  Router.route('/top/:limit?', {
    name: 'posts_top',
    controller: Posts.controllers.top
  });

  // New

  Router.route('/new/:limit?', {
    name: 'posts_new',
    controller: Posts.controllers.new
  });

  // Best

  Router.route('/best/:limit?', {
    name: 'posts_best',
    controller: Posts.controllers.best
  });

  // Pending

  Router.route('/pending/:limit?', {
    name: 'posts_pending',
    controller: Posts.controllers.pending
  });

  // Scheduled

  Router.route('/scheduled/:limit?', {
    name: 'posts_scheduled',
    controller: Posts.controllers.scheduled
  });

  // Post Edit

  Router.route('/posts/:_id/edit', {
    name: 'post_edit',
    template: 'post_edit',
    waitOn: function () {
      return [
        Telescope.subsManager.subscribe('singlePost', this.params._id),
        Telescope.subsManager.subscribe('allUsersAdmin')
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

  // Post Page

  Router.route('/posts/:_id/:slug?', {
    name: 'post_page',
    controller: Posts.controllers.page
  });

  Router.route('/posts/:_id/comment/:commentId', {
    name: 'post_page_comment',
    controller: Posts.controllers.page,
    onAfterAction: function () {
      // TODO: scroll to comment position
    }
  });

  // Post Submit

  Router.route('/submit', {
    name: 'post_submit',
    template: 'post_submit',
    waitOn: function () {
      return Telescope.subsManager.subscribe('allUsersAdmin');
    }
  });

});
