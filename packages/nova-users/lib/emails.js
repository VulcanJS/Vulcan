const getUser = (userId) => {
  return typeof Users.findOne(userId) === "undefined" ? Users.findOne() : Users.findOne(userId);
};

Telescope.email.addEmails({
  
  newUser: {
    template: "newUser",
    path: "/email/new-user/:_id?",
    getProperties: Users.getNotificationProperties,
    subject() {
      return "A new user has been created";
    },
    getTestObject: getUser
  },

  accountApproved: {
    template: "accountApproved",
    path: "/email/account-approved/:_id?",
    getProperties: Users.getNotificationProperties,
    subject() {
      return "Your account has been approved.";
    },
    getTestObject: getUser
  }

});