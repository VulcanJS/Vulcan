Template.hello.helpers({
  name: function () {
    if (Meteor.user()) {
      return Users.getDisplayName(Meteor.user());
    } else {
      return "You";
    }
  }
});