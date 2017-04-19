/*
Register email templates.
*/

import VulcanEmail from 'meteor/vulcan:email';

VulcanEmail.addTemplates({
  customEmail: Assets.getText("lib/server/emails/reminderEmail.handlebars")
});
