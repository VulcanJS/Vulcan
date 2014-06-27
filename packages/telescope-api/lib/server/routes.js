Meteor.startup(function () {

  Router.map(function() {

    this.route('api', {
      where: 'server',
      path: '/api/:limit?',
      action: function() {
        var limit = parseInt(this.params.limit);
        this.response.write(serveAPI(limit));
        this.response.end();
      }
    });

  });

});