Meteor.startup(function () {

  Router.map(function() {

    // Post RSS

    this.route('feed', {
      where: 'server',
      path: '/feed.xml',
      action: function() {
        this.response.write(servePostRSS('new'));
        this.response.end();
      }
    });

    // Top Post RSS

    this.route('feed', {
      where: 'server',
      path: 'rss/posts/top.xml',
      action: function() {
        this.response.write(servePostRSS('top'));
        this.response.end();
      }
    });

    // Best Post RSS

    this.route('feed', {
      where: 'server',
      path: 'rss/posts/best.xml',
      action: function() {
        this.response.write(servePostRSS('best'));
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
