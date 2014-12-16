adminNav.push({
  route: 'rssUrls',
  label: 'RSS Urls'
});

Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['rssUrls']});
  
  // RSS Urls Admin

  Router.route('/rss-urls', {
    name: 'rssUrls',
    waitOn: function() {
      return Meteor.subscribe('rssUrls');
    },
    template: getTemplate('rssUrls')
  });

});
