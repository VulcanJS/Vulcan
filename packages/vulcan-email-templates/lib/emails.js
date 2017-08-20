import VulcanEmail from 'meteor/vulcan:email';

VulcanEmail.addEmails({

  test: {
    template: "test",
    path: "/email/test",
    data() {
      return {date: new Date()};
    },
    subject() {
      return "This is a test";
    },
  }

});