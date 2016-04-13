// email test routes (make available to client & server)

Telescope.email.addEmails({

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