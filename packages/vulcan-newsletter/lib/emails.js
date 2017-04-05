import VulcanEmail from 'meteor/vulcan:email';
// email test routes (make available to client & server)

VulcanEmail.addEmails({

  newsletter: {
    template: "newsletter",
    path: "/email/newsletter",
    subject() {
      return "[Generated on server]";
    }
  },

  newsletterConfirmation: {
    template: "newsletterConfirmation",
    path: "/email/newsletter-confirmation",
    subject() {
      return "Newsletter confirmation";
    }
  }

});