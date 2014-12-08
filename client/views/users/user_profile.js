Template[getTemplate('user_profile')].helpers({
  userProfileDisplay: function () {
    return userProfileDisplay;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});