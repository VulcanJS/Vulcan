import NovaEmail from '../namespace.js';
import Juice from 'juice';
import htmlToText from 'html-to-text';
import Handlebars from 'handlebars';
import { Utils, getSetting } from 'meteor/nova:lib'; // import from nova:lib because nova:core is not loaded yet

NovaEmail.templates = {};

NovaEmail.addTemplates = templates => {
  _.extend(NovaEmail.templates, templates);
};

NovaEmail.getTemplate = templateName => Handlebars.compile(
  NovaEmail.templates[templateName], 
  { noEscape: true}
);

NovaEmail.buildTemplate = (htmlContent, optionalProperties = {}) => {

  const emailProperties = {
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

  const emailHTML = NovaEmail.getTemplate("wrapper")(emailProperties);

  const inlinedHTML = Juice(emailHTML, {preserveMediaQueries: true});

  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'

  return doctype+inlinedHTML;
};

NovaEmail.send = (to, subject, html, text) => {

  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND

  const from = getSetting('defaultEmail', 'noreply@example.com');
  const siteName = getSetting('title', 'Telescope');
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

  const email = {
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

NovaEmail.buildAndSend = (to, subject, template, properties) => {
  const html = NovaEmail.buildTemplate(NovaEmail.getTemplate(template)(properties));
  return NovaEmail.send (to, subject, html);
};

NovaEmail.buildAndSendHTML = (to, subject, html) => NovaEmail.send(
  to,
  subject,
  NovaEmail.buildTemplate(html)
);
