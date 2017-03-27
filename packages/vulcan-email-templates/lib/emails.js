import VulcanEmail from 'meteor/vulcan:email';

VulcanEmail.addEmails({

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