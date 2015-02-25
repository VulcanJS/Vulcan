Template[getTemplate('user_edit')].helpers({
  userProfileEdit: function () {
    return userProfileEdit;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});
