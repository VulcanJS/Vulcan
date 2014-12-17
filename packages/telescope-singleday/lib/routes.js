// Controller for post digest

PostsDigestController = RouteController.extend({

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
  },

  getTitle: function () {
    return i18n.t('single_day') + ' - ' + getSetting('title');
  },

  getDescription: function () {
    return i18n.t('posts_of_a_single_day');
  },

  fastRender: true

});

Meteor.startup(function () {

  // Digest

  Router.route('/digest/:year/:month/:day', {
    name: 'posts_digest',
    controller: PostsDigestController
  });

  Router.route('/digest', {
    name: 'posts_digest_default',
    controller: PostsDigestController
  });

});