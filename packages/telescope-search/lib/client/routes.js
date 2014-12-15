Meteor.startup(function () {

  PostsSearchController = PostsListController.extend({
    view: 'search',
    onBeforeAction: function() {
      var query = this.params.query;
      if ('q' in query) {
        Session.set('searchQuery', query.q);
        if (query.q) {
          Meteor.call('logSearch', query.q)
        }
      }
      this.next();
    }
  });

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['logs']});

  // Search

  Router.route('/search/:limit?', {
    name: 'search',
    controller: PostsSearchController
  });

  // Search Logs

  Router.route('/logs/:limit?', {
    name: 'searchLogs',
    waitOn: function () {
      var limit = this.params.limit || 100;
      if(Meteor.isClient) {
        Session.set('logsLimit', limit);
      }
      return Meteor.subscribe('searches', limit);
    },
    data: function () {
      return Searches.find({}, {sort: {timestamp: -1}});
    },
    fastRender: true
  });

});
