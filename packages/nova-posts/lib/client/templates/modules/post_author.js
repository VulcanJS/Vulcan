Template.post_author.helpers({
  displayName: function () {
    var user = Meteor.users.findOne(this.userId);
    if (user) {
      return Users.getDisplayName(user);
    } else {
      return this.author;
    }
  }
});