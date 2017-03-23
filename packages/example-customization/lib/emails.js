/* 
We register new emails on both client and server to make them available
to the emails dashboard.
*/

import NovaEmail from 'meteor/nova:email';

NovaEmail.addEmails({

  customEmail: {
    template: "customEmail",
    path: "/email/custom-email",
    getProperties() {return {};},
    subject() {
      return "My awesome new email";
    },
    getTestObject() {return {};}
  }

});