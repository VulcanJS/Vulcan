import NovaEmail from 'meteor/nova:email';

NovaEmail.addTemplates({
  emailInvite: Assets.getText("lib/server/templates/emailInvite.handlebars")
});