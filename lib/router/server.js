Meteor.startup(function (){

  // Link Out

  Router.route('/out', {
    name: 'out',
    where: 'server',
    action: function(){
      var query = this.request.query;
      if(query.url){
        var decodedUrl = decodeURIComponent(query.url);
        var post = Posts.findOne({url: decodedUrl});
        if(post){
            var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
            Meteor.call('increasePostClicks', post._id, sessionId);
        }
        this.response.writeHead(302, {'Location': query.url});
        this.response.end();
      }
    }
  });

  // Notification email

  Router.route('/email/notification/:id?', {
    name: 'notification',
    where: 'server',
    action: function() {
      var notification = Notifications.findOne(this.params.id);
      var notificationContents = buildEmailNotification(notification);
      this.response.write(notificationContents.html);
      this.response.end();
    }
  });

  // New user email

  Router.route('/email/new-user/:id?', {
    name: 'newUser',
    where: 'server',
    action: function() {
      var user = Meteor.users.findOne(this.params.id);
      var emailProperties = {
        profileUrl: getProfileUrl(user),
        username: getUserName(user)
      };
      html = getEmailTemplate('emailNewUser')(emailProperties);
      this.response.write(buildEmailTemplate(html));
      this.response.end();
    }
  });

  // New post email

  Router.route('/email/new-post/:id?', {
    name: 'newPost',
    where: 'server',
    action: function() {
      var post = Posts.findOne(this.params.id);
      html = Handlebars.templates[getTemplate('emailNewPost')](getPostProperties(post));
      this.response.write(buildEmailTemplate(html));
      this.response.end();
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