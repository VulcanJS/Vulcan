Template[getTemplate('avatar')].helpers({
  url: function () {
    if (this.user) {
      return getAvatarUrl(this.user);
    }
    else if (this.userId) {
      var user = Meteor.users.findOne(this.userId);
      if (user) {
        return getAvatarUrl(user);
      }
    }
  },
  cssClass: function () {
    if (this.class) {
      return this.class;
    }
    return 'user-avatar';
  }
});