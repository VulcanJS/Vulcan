// import Email from 'meteor/nova:email';

Telescope.email.addTemplates({
  emailInvite: Assets.getText("lib/server/templates/emailInvite.handlebars")
});