Telescope.email.routes = Telescope.email.routes.concat([
  {
    name: "New User",
    path: "/email/new-user/:_id?",
    action: (params, req, res, next) => {
      var html;
      var user = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
      var emailProperties = {
        profileUrl: Users.getProfileUrl(user),
        username: Users.getUserName(user)
      };
      html = Telescope.email.getTemplate('newUser')(emailProperties);
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "Account Approved",
    path: "/email/account-approved/:_id?",
    action: (params, req, res, next) => {
      var user = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
      var emailProperties = {
        profileUrl: Users.getProfileUrl(user),
        username: Users.getUserName(user),
        siteTitle: Telescope.settings.get('title'),
        siteUrl: Telescope.utils.getSiteUrl()
      };
      var html = Telescope.email.getTemplate('accountApproved')(emailProperties);
      res.end(Telescope.email.buildTemplate(html));
    }
  }
]);