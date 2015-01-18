Meteor.startup(function (){

  // Link Out

  Router.route('/out', {
    name: 'out',
    where: 'server',
    action: function(){
      var query = this.request.query;
      if(query.url){ // for some reason, query.url doesn't need to be decoded
        var post = Posts.findOne({url: query.url});
        if (post) {
          var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
          Meteor.call('increasePostClicks', post._id, sessionId);
          this.response.writeHead(302, {'Location': query.url});
        } else {
          // don't redirect if we can't find a post for that link
          this.response.write('Invalid URL');
        }
        this.response.end();
      }
    }
  });

  // Account approved email

  Router.route('/email/account-approved/:id?', {
    name: 'accountApproved',
    where: 'server',
    action: function() {
      var user = Meteor.users.findOne(this.params.id);
      var emailProperties = {
        profileUrl: getProfileUrl(user),
        username: getUserName(user),
        siteTitle: getSetting('title'),
        siteUrl: getSiteUrl()
      };
      html = Handlebars.templates[getTemplate('emailAccountApproved')](emailProperties);
      this.response.write(buildEmailTemplate(html));
      this.response.end();
    }
  });

});