Meteor.startup(function () {

  Router.map(function() {

    // RSS

    this.route('feed', {
      where: 'server',
      path: '/feed.xml',
      action: function() {
        this.response.write(serveRSS());
        this.response.end();
      }
    });

  });

});