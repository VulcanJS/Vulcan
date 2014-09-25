Meteor.startup(function () {

  Router.map(function() {

    // Post RSS

    this.route('feed', {
      where: 'server',
      path: '/feed.xml',
      action: function() {
        this.response.write(servePostRSS());
        this.response.end();
      }
    });

    // Comment RSS

    this.route('rss_comments', {
      where: 'server',
      path: '/rss/comments.xml',
      action: function() {
        this.response.write(serveCommentRSS());
        this.response.end();
      }
    });

  });

});
