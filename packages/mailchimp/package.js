Package.describe("Mailchimp package");

Package.on_use(function (api) {
  api.add_files(['mailchimp.js'], 'server');
  if(api.export)
    api.export('MailChimpAPI');
});

Npm.depends({
  "mailchimp": "1.0.3"
});