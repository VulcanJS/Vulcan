_.forEach(Telescope.email.emails, (email, key) => {
  Picker.route(email.path, (params, req, res) => {
    res.end(Telescope.email.buildTemplate(email.getTestHTML.bind(email)(params._id)));
  });
});
