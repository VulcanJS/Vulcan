// email test routes (make available to client & server)

Telescope.email.routes = Telescope.email.routes.concat([
  {
    name: "Newsletter",
    path: "/email/newsletter"
  },
  {
    name: "Newsletter Confirmation",
    path: "/email/newsletter-confirmation"
  }
]);