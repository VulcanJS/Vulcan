import NovaEmail from 'meteor/nova:email';
import Users from 'meteor/nova:users';
import { getSetting, Utils } from 'meteor/nova:core';

Meteor.methods({
  "email.test": function (emailName) {

    const email = NovaEmail.emails[emailName];

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
        html = NovaEmail.buildTemplate(NovaEmail.getTemplate(email.template)(properties));

      }

      // get subject
      const subject = "[Test] " + email.subject.bind(email)(properties);

      NovaEmail.send (getSetting('defaultEmail'), subject, html)

      return subject;

    } else {
      throw new Error(Utils.encodeIntlError({id: "app.noPermission"}));
    }
  }
});
