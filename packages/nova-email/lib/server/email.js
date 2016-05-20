import Juice from 'juice';
import htmlToText from 'html-to-text';
import Handlebars from 'handlebars';

Telescope.email.templates = {};

Telescope.email.addTemplates = function (templates) {
  _.extend(Telescope.email.templates, templates);
};

// for template "foo", check if "custom_foo" exists. If it does, use it instead
Telescope.email.getTemplate = function (templateName) {

  var template = templateName;

  // note: template prefixes are disabled
  // go through prefixes and keep the last one (if any) that points to a valid template
  // Telescope.config.customPrefixes.forEach(function (prefix) {
  //   if(typeof Telescope.email.templates[prefix+templateName] === 'string'){
  //     template = prefix + templateName;
  //   }
  // });

  // return Handlebars.templates[template];

  // console.log(templateName)
  // console.log(Telescope.email.templates[template])

  return Handlebars.compile(Telescope.email.templates[template]);

};

Telescope.email.buildTemplate = function (htmlContent) {

  var emailProperties = {
    secondaryColor: Telescope.settings.get('secondaryColor', '#444444'),
    accentColor: Telescope.settings.get('accentColor', '#DD3416'),
    siteName: Telescope.settings.get('title'),
    tagline: Telescope.settings.get('tagline'),
    siteUrl: Telescope.utils.getSiteUrl(),
    body: htmlContent,
    unsubscribe: '',
    accountLink: Telescope.utils.getSiteUrl()+'account',
    footer: Telescope.settings.get('emailFooter'),
    logoUrl: Telescope.settings.get('logoUrl'),
    logoHeight: Telescope.settings.get('logoHeight'),
    logoWidth: Telescope.settings.get('logoWidth')
  };

  var emailHTML = Telescope.email.getTemplate("wrapper")(emailProperties);

  var inlinedHTML = Juice(emailHTML);

  var doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'

  return doctype+inlinedHTML;
};

Telescope.email.send = function(to, subject, html, text){

  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND

  var from = Telescope.settings.get('defaultEmail', 'noreply@example.com');
  var siteName = Telescope.settings.get('title', 'Telescope');
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

Telescope.email.buildAndSendHTML = function (to, subject, html) {
  return Telescope.email.send (to, subject, Telescope.email.buildTemplate(html));
};

Meteor.methods({
  testEmail: function (emailName) {
    
    const email = Telescope.email.emails[emailName];
    
    if(Users.is.adminById(this.userId)){

      console.log("// testing email ["+emailName+"]");
      let html, properties;
    
      // if email has a custom way of generating its HTML, use it
      if (typeof email.getTestHTML !== "undefined") {

        html = email.getTestHTML.bind(email)();

      } else {

        // else get test object (sample post, comment, user, etc.)
        const testObject = email.getTestObject();
        // get test object's email properties
        properties = email.getProperties(testObject);

        // then apply email template to properties, and wrap it with buildTemplate
        html = Telescope.email.buildTemplate(Telescope.email.getTemplate(email.template)(properties));

      }

      // get subject
      const subject = "[Test] " + email.subject.bind(email)(properties);

      Telescope.email.send (Telescope.settings.get('defaultEmail'), subject, html)
 
      return subject;
    
    } else {
      throw new Meteor.Error("must_be_admin", "You must be an admin to send test emails");
    }
  }
});