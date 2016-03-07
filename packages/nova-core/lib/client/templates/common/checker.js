Template.checker.helpers({
  allow: function () {
    return Users.can[this.check](Meteor.user(), this.doc);
  }
});