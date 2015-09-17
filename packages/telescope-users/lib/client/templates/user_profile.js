Template.user_profile.onCreated(function  () {
  var user = this.data.user;
  Telescope.SEO.set({
    title: user.getDisplayName(),
    description: i18n.t('the_profile_of') + ' ' + user.getDisplayName()
  });
});