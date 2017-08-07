/* 
Register email templates.
*/

import VulcanEmail from 'meteor/vulcan:email';

VulcanEmail.addTemplates({
  newPost: Assets.getText("lib/server/emails/customNewPost.handlebars"),
  customEmail: Assets.getText("lib/server/emails/customEmail.handlebars")
});