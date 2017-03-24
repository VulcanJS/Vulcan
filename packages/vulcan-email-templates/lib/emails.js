import NovaEmail from 'meteor/vulcan:email';

NovaEmail.addEmails({

  test: {
    template: "test",
    path: "/email/test",
    getProperties() {
      return {date: new Date()};
    },
    subject() {
      return "This is a test";
    },
    getTestObject() {
      return {date: new Date()};
    }
  }

});