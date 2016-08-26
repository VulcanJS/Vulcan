import Telescope from 'meteor/nova:lib';
import NovaEmail from '../namespace.js';
import Juice from 'juice';
import htmlToText from 'html-to-text';
import Handlebars from 'handlebars';

NovaEmail.templates = {};

NovaEmail.addTemplates = function (templates) {
  _.extend(NovaEmail.templates, templates);
};

// for template "foo", check if "custom_foo" exists. If it does, use it instead
NovaEmail.getTemplate = function (templateName) {

  var template = templateName;

  // note: template prefixes are disabled
  // go through prefixes and keep the last one (if any) that points to a valid template
  // Telescope.config.customPrefixes.forEach(function (prefix) {
  //   if(typeof NovaEmail.templates[prefix+templateName] === 'string'){
  //     template = prefix + templateName;
  //   }
  // });

  // return Handlebars.templates[template];

  // console.log(templateName)
  // console.log(NovaEmail.templates[template])

  return Handlebars.compile(NovaEmail.templates[template], {
    noEscape: true
  });

};

NovaEmail.buildTemplate = function (htmlContent, optionalProperties = {}) {

  var emailProperties = {
    secondaryColor: Telescope.settings.get('secondaryColor', '#444444'),
    accentColor: Telescope.settings.get('accentColor', '#DD3416'),
    siteName: Telescope.settings.get('title', "Nova"),
    tagline: Telescope.settings.get('tagline'),
    siteUrl: Telescope.utils.getSiteUrl(),
    body: htmlContent,
    unsubscribe: '',
    accountLink: Telescope.utils.getSiteUrl()+'account',
    footer: Telescope.settings.get('emailFooter'),
    logoUrl: Telescope.settings.get('logoUrl'),
    logoHeight: Telescope.settings.get('logoHeight'),
    logoWidth: Telescope.settings.get('logoWidth'),
    ...optionalProperties
  };

  var emailHTML = NovaEmail.getTemplate("wrapper")(emailProperties);

  var inlinedHTML = Juice(emailHTML, {preserveMediaQueries: true});

  var doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'

  return doctype+inlinedHTML;
};

NovaEmail.send = function(to, subject, html, text){

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

  try {
    Email.send(email);
  } catch (error) {
    console.log("// error while sending email:")
    console.log(error)
  }

  return email;

};

NovaEmail.buildAndSend = function (to, subject, template, properties) {
  var html = NovaEmail.buildTemplate(NovaEmail.getTemplate(template)(properties));
  return NovaEmail.send (to, subject, html);
};

NovaEmail.buildAndSendHTML = function (to, subject, html) {
  return NovaEmail.send (to, subject, NovaEmail.buildTemplate(html));
};
