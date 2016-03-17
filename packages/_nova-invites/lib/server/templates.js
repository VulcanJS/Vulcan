import Email from 'meteor/nova:email';

Email.addTemplates({
  emailInvite: Assets.getText("lib/server/templates/emailInvite.handlebars")
});