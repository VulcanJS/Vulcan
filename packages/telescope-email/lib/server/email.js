/**
 * Telescope Email namespace
 * @namespace Email
 */
Telescope.email = {};

var htmlToText = Npm.require('html-to-text');

// for template "foo", check if "custom_foo" exists. If it does, use it instead
Telescope.email.getTemplate = function (template) {
  var customEmailTemplate = Handlebars.templates["custom_"+template];
  if(typeof customEmailTemplate === 'function'){
    return customEmailTemplate;
  } else {
    return Handlebars.templates[template];
  }
};

Telescope.email.buildTemplate = function (htmlContent) {

  var emailProperties = {
    secondaryColor: Settings.get('secondaryColor', '#444444'),
    accentColor: Settings.get('accentColor', '#DD3416'),
    siteName: Settings.get('title'),
    tagline: Settings.get('tagline'),
    siteUrl: Telescope.utils.getSiteUrl(),
    body: htmlContent,
    unsubscribe: '',
    accountLink: Telescope.utils.getSiteUrl()+'account',
    footer: Settings.get('emailFooter'),
    logoUrl: Settings.get('logoUrl'),
    logoHeight: Settings.get('logoHeight'),
    logoWidth: Settings.get('logoWidth')
  };

  var emailHTML = Telescope.email.getTemplate("emailWrapper")(emailProperties);

  var inlinedHTML = juice(emailHTML);

  var doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'

  return doctype+inlinedHTML;
};

Telescope.email.send = function(to, subject, html, text){

  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND

  var from = Settings.get('defaultEmail', 'noreply@example.com');
  var siteName = Settings.get('title', 'Telescope');
  subject = '['+siteName+'] '+subject;

  if (typeof text === 'undefined'){
    // Auto-generate text version if it doesn't exist. Has bugs, but should be good enough.
    var text = htmlToText.fromString(html, {
        wordwrap: 130
    });
  }

  console.log('//////// sending email…');
  console.log('from: '+from);
  console.log('to: '+to);
  console.log('subject: '+subject);
  // console.log('html: '+html);
  // console.log('text: '+text);

  var email = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  Email.send(email);

  return email;
};

Telescope.email.buildAndSend = function (to, subject, template, properties) {
  var html = Telescope.email.buildTemplate(Telescope.email.getTemplate(template)(properties));
  return Telescope.email.send (to, subject, html);
};

Meteor.methods({
  testEmail: function () {
    if(Users.is.adminById(this.userId)){
      var email = Telescope.email.buildAndSend (Settings.get('defaultEmail'), 'Telescope email test', 'emailTest', {date: new Date()});
    }
  }
});

function adminUserCreationNotification (user) {
  // send notifications to admins
  var admins = Users.adminUsers();
  admins.forEach(function(admin){
    if (Users.getSetting(admin, "notifications.users", false)) {
      var emailProperties = {
        profileUrl: Users.getProfileUrl(user, true),
        username: Users.getUserName(user)
      };
      var html = Telescope.email.getTemplate('emailNewUser')(emailProperties);
      Telescope.email.send(Users.getEmail(admin), 'New user account: '+Users.getUserName(user), Telescope.email.buildTemplate(html));
    }
  });
  return user;
}
Telescope.callbacks.add("onCreateUser", adminUserCreationNotification);
