// email test routes (make available to client & server)

Telescope.email.emails = Object.assign(Telescope.email.emails, {

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