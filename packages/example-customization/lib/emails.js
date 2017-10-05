/* 
We register new emails on both client and server to make them available
to the emails dashboard.
*/

import VulcanEmail from 'meteor/vulcan:email';

VulcanEmail.addEmails({

  customEmail: {
    template: "customEmail",
    path: "/email/custom-email",
    subject() {
      return "My awesome new email";
    }
  }

});