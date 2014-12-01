Meteor.startup(function () {

  // Post RSS

  Router.route('/feed.xml', {
    name: 'feed',
    where: 'server',
    action: function() {
      this.response.write(servePostRSS());
      this.response.end();
    }
  });

  // Comment RSS

  Router.route('/rss/comments.xml', {
    name: 'rss_comments',
    where: 'server',
    action: function() {
      this.response.write(serveCommentRSS());
      this.response.end();
    }
  });

});
