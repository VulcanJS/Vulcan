Template.user_profile.onCreated(function  () {
  var user = this.data.user;
  DocHead.setTitle(user.getDisplayName());
});