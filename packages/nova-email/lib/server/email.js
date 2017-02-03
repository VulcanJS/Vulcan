import NovaEmail from '../namespace.js';
import Juice from 'juice';
import htmlToText from 'html-to-text';
import Handlebars from 'handlebars';
import { Utils, getSetting } from 'meteor/nova:lib'; // import from nova:lib because nova:core is not loaded yet

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
    secondaryColor: getSetting('secondaryColor', '#444444'),
    accentColor: getSetting('accentColor', '#DD3416'),
    siteName: getSetting('title', "Nova"),
    tagline: getSetting('tagline'),
    siteUrl: Utils.getSiteUrl(),
    body: htmlContent,
    unsubscribe: '',
    accountLink: Utils.getSiteUrl()+'account',
    footer: getSetting('emailFooter'),
    logoUrl: getSetting('logoUrl'),
    logoHeight: getSetting('logoHeight'),
    logoWidth: getSetting('logoWidth'),
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

  var from = getSetting('defaultEmail', 'noreply@example.com');
  var siteName = getSetting('title', 'Telescope');
  subject = '['+siteName+'] '+subject;

  if (typeof text === 'undefined'){
    // Auto-generate text version if it doesn't exist. Has bugs, but should be good enough.
    text = htmlToText.fromString(html, {
        wordwrap: 130
    });
  }

  console.log('//////// sending email…'); // eslint-disable-line
  console.log('from: '+from); // eslint-disable-line
  console.log('to: '+to); // eslint-disable-line
  console.log('subject: '+subject); // eslint-disable-line
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
    console.log("// error while sending email:"); // eslint-disable-line
    console.log(error); // eslint-disable-line
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
