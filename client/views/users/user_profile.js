Template[getTemplate('user_profile')].helpers({
  userProfileBlocks: function () {
    return userProfileDisplay;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});