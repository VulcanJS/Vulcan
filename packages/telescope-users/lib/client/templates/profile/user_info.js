Template.user_info.helpers({
  canEditProfile: function() {
    var currentUser = Meteor.user();
    return currentUser && (this._id === currentUser._id || Users.is.admin(currentUser));
  },
  createdAtFormatted: function() {
    return this.createdAt;
  },
  canInvite: function() {
    // if the user is logged in, the target user hasn't been invited yet, invites are enabled, and user is not viewing their own profile
    return Meteor.user() && Meteor.user()._id !== this._id && !Users.is.invited(this) && Telescope.utils.invitesEnabled() && Users.can.invite(Meteor.user());
  },
  inviteCount: function() {
    return Meteor.user().telescope.inviteCount;
  },
  getTwitterName: function () {
    return Users.getTwitterName(this);
  },
  getGitHubName: function () {
    return Users.getGitHubName(this);
  },
  publicProfileFields: function () {
    var user = this;
    var schema = Users.simpleSchema();
    var publicData = _.compact(_.map(schema.getProfileFields(), function (fieldName) {
      if (Telescope.getNestedProperty(user, fieldName)) {
        var field = schema._schema[fieldName];
        var item = {
          label: i18n.t(fieldName.replace("telescope.", "")),
          value: Telescope.getNestedProperty(user, fieldName)
        };
        if (!!field.template) {
          item.template = field.template;
        }
        return item;
      }
    }));
    return publicData;
  },
  isUsingPassword: function  () {
    return !!this.services.password
  }
});

Template.user_info.events({
  'click .invite-link': function(e, instance){
    var user = this;
    Meteor.call('inviteUser', {userId: user._id}, function(error, success){
      if (error) {
        Messages.flash(error, "error");
        Messages.clearSeen();
      } else {
        Messages.flash('Thanks, user has been invited.', "success");
        Messages.clearSeen();
      }
    });
  }
});
