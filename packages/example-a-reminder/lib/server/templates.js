/*
Register email templates.
*/

import VulcanEmail from 'meteor/vulcan:email';

VulcanEmail.addTemplates({
  reminderEmail: Assets.getText("lib/server/emails/reminderEmail.handlebars")
});
