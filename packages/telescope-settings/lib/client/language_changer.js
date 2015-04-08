var query = Settings.collection.find();

query.observeChanges({
  added: function (id, fields) {
    if (fields.language)
      setLanguage(fields.language);
  },
  changed: function (id, fields) {
    if (fields.language)
      setLanguage(fields.language);
  }
});
