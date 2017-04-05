import VulcanEmail from 'meteor/vulcan:email';
import Users from 'meteor/vulcan:users';
import { getSetting, Utils } from 'meteor/vulcan:core';

Meteor.methods({
  "email.test": function (emailName) {

    const email = VulcanEmail.emails[emailName];

    if(Users.isAdminById(this.userId)){

      console.log("// testing email ["+emailName+"]"); // eslint-disable-line
      let html, properties;

      // if email has a custom way of generating its HTML, use it
      if (typeof email.getTestHTML !== "undefined") {

        html = email.getTestHTML.bind(email)();

      } else {

        // else get test object (sample post, comment, user, etc.)
        const testObject = email.getTestObject();
        // get test object's email properties
        properties = email.getProperties(testObject);

        // then apply email template to properties, and wrap it with buildTemplate
        html = VulcanEmail.buildTemplate(VulcanEmail.getTemplate(email.template)(properties));

      }

      // get subject
      const subject = "[Test] " + email.subject.bind(email)(properties);

      VulcanEmail.send (getSetting('defaultEmail'), subject, html)

      return subject;

    } else {
      throw new Error(Utils.encodeIntlError({id: "app.noPermission"}));
    }
  }
});
