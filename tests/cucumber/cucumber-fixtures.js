Meteor.startup(function() {
  if (Meteor.isClient || !process.env.IS_MIRROR) {
    return;
  }
  Meteor.users.remove({});
  Accounts.createUser({
    username: "joshowens",
    email: "josh@test.com",
    password: "good password",
    profile: {
      name: "Josh Owens"
    }
  });
});
