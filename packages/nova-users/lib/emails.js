Telescope.email.emails = Object.assign(Telescope.email.emails, {
  
  newUser: {
    template: "newUser",
    path: "/email/new-user/:_id?",
    getProperties: Users.getNotificationProperties,
    subject() {
      return "A new user has been created";
    },
    getTestHTML(userId)  {
      var user = typeof userId === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(userId);
      return Telescope.email.getTemplate(this.template)(this.getProperties(user));
    }
  },

  accountApproved: {
    template: "accountApproved",
    path: "/email/account-approved/:_id?",
    getProperties: Users.getNotificationProperties,
    subject() {
      return "Your account has been approved.";
    },
    getTestHTML(userId) {
      var user = typeof userId === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(userId);
      return Telescope.email.getTemplate(this.template)(this.getProperties(user));
    }
  }

});