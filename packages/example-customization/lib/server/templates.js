/* 
Register email templates.
*/

import NovaEmail from 'meteor/vulcan:email';

NovaEmail.addTemplates({
  newPost: Assets.getText("lib/server/emails/customNewPost.handlebars"),
  customEmail: Assets.getText("lib/server/emails/customEmail.handlebars")
});