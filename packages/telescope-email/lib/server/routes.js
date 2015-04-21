Meteor.startup(function () {

  // New user email

  Router.route('/email/new-user/:id?', {
    name: 'newUser',
    where: 'server',
    action: function() {
      var user = Meteor.users.findOne(this.params.id);
      var emailProperties = {
        profileUrl: Users.getProfileUrl(user),
        username: Users.getUserName(user)
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
      if (!!post) {
        html = getEmailTemplate('emailNewPost')(Posts.getProperties(post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      this.response.write(buildEmailTemplate(html));
      this.response.end();
    }
  });


});
