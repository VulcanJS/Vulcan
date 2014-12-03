Meteor.startup(function () {

    // New Post RSS

    Router.route('/feed.xml', function () {
      this.response.write(servePostRSS('new', 'feed.xml'));
      this.response.end();
    }, {where: 'server'});

    // New Post RSS

    Router.route('/rss/posts/new.xml', function () {
      this.response.write(servePostRSS('top', 'rss/posts/new.xml'));
      this.response.end();
    }, {where: 'server'});

    // Top Post RSS

    Router.route('/rss/posts/top.xml', function () {
      this.response.write(servePostRSS('top', 'rss/posts/top.xml'));
      this.response.end();
    }, {where: 'server'});

    // Best Post RSS

    Router.route('/rss/posts/best.xml', function () {
      this.response.write(servePostRSS('best', 'rss/posts/best.xml'));
      this.response.end();
    }, {where: 'server'});

    // Comment RSS

    Router.route('/rss/comments.xml', function() {
      this.response.write(serveCommentRSS());
      this.response.end();
    }, {where: 'server'});

});
