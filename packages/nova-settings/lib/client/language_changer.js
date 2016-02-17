var query = Settings.find();

query.observeChanges({
  added: function (id, fields) {
    if (fields.language)
      i18n.setLanguage(fields.language);
  },
  changed: function (id, fields) {
    if (fields.language)
      i18n.setLanguage(fields.language);
  }
});
