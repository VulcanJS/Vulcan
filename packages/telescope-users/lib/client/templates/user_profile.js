Template.user_profile.onCreated(function  () {
  var user = this.data.user;
  Telescope.SEO.setTitle(user.getDisplayName());
});