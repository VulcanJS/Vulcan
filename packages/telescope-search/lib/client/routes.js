adminNav.push({
  route: 'searchLogs',
  label: 'Search Logs'
});


Meteor.startup(function () {

  PostsSearchController = PostsListController.extend({
    view: 'search',
    onBeforeAction: function() {
      if ("q" in this.params) {
        Session.set("searchQuery", this.params.q);
      }
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
