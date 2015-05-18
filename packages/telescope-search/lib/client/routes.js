Meteor.startup(function () {

  Posts.controllers.search = Posts.controllers.list.extend({

    view: 'search',
    
    showViewsNav: false,
    
    getTitle: function() {
      return i18n.t("Search") + ' - ' + Settings.get('title', "Telescope");
    },
    
    getDescription: function() {
      return Settings.get('description');
    },
    
    onBeforeAction: function() {
      var query = this.params.query;
      if ('q' in query) {
        // if search box has 'empty' class, that means user just deleted last character in search keyword
        // but router hasn't updated url, so params.query still has '?q=<LAST CHARACTER>'
        // if we set searchQuery in this case, user will see last character pops up again unexpectedly
        // so add this check to fix the bug. issue #825
        if (!$('.search').hasClass('empty'))  {
          Session.set('searchQuery', query.q);
        }
        if (query.q) {
          Meteor.call('logSearch', query.q);
        }
      }
      this.next();
    },

    data: function () {
      
      var terms = {
        view: "search",
        limit: this.params.limit || Settings.get('postsPerPage', 10),
        query: Session.get("searchQuery")
      };
      
      return {terms: terms};
    }
  });

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['logs']});

  // Search

  Router.route('/search/:limit?', {
    name: 'search',
    controller: Posts.controllers.search
  });

  // Search Logs

  Router.route('/logs/:limit?', {
    controller: Telescope.controllers.admin,
    name: 'searchLogs',
    template: 'search_logs',
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
