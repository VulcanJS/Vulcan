/* eslint-disable no-console */
import VulcanEmail from '../namespace.js';
import Juice from 'juice';
import htmlToText from 'html-to-text';
import Handlebars from 'handlebars';
import { Utils, getSetting, registerSetting, runQuery, Strings } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core is not loaded yet

registerSetting('secondaryColor', '#444444');
registerSetting('accentColor', '#DD3416');
registerSetting('title', 'My App');
registerSetting('tagline');
registerSetting('emailFooter');
registerSetting('logoUrl');
registerSetting('logoHeight');
registerSetting('logoWidth');
registerSetting('defaultEmail', 'noreply@example.com');
registerSetting('title', 'Vulcan');
registerSetting('enableDevelopmentEmails', false);

VulcanEmail.templates = {};

VulcanEmail.addTemplates = templates => {
  _.extend(VulcanEmail.templates, templates);
};

VulcanEmail.getTemplate = templateName => Handlebars.compile(
  VulcanEmail.templates[templateName],
  { noEscape: true, strict: true}
);

VulcanEmail.buildTemplate = (htmlContent, data = {}, locale) => {
  const emailProperties = {
    secondaryColor: getSetting('secondaryColor', '#444444'),
    accentColor: getSetting('accentColor', '#DD3416'),
    siteName: getSetting('title', 'My App'),
    tagline: getSetting('tagline'),
    siteUrl: Utils.getSiteUrl(),
    body: htmlContent,
    unsubscribe: '',
    accountLink: Utils.getSiteUrl()+'account',
    footer: getSetting('emailFooter'),
    logoUrl: getSetting('logoUrl'),
    logoHeight: getSetting('logoHeight'),
    logoWidth: getSetting('logoWidth'),
    ...data,
    __: Strings[locale],
  };

  const emailHTML = VulcanEmail.getTemplate("wrapper")(emailProperties);
  const inlinedHTML = Juice(emailHTML, {preserveMediaQueries: true});
  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'

  return doctype+inlinedHTML;
};

VulcanEmail.generateTextVersion = html => {
  return htmlToText.fromString(html, {
    wordwrap: 130
  });
}

VulcanEmail.send = (to, cc, bcc, replyTo, subject, html, text, throwErrors) => {
  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND

  const from = getSetting('defaultEmail', 'noreply@example.com');
  const siteName = getSetting('title', 'Vulcan');
  subject = '['+siteName+'] '+subject;

  if (typeof text === 'undefined'){
    // Auto-generate text version if it doesn't exist. Has bugs, but should be good enough.
    text = VulcanEmail.generateTextVersion(html);
  }

  const email = {
    from: from,
    to: to,
    cc: cc,
    bcc: bcc,
    replyTo: replyTo,
    subject: subject,
    text: text,
    html: html
  };
  
  if (process.env.NODE_ENV === 'production' || getSetting('enableDevelopmentEmails', false)) {

    console.log('//////// sending email…'); // eslint-disable-line
    console.log('from: '+from); // eslint-disable-line
    console.log("cc: " + cc); // eslint-disable-line
    console.log("bcc: " + bcc); // eslint-disable-line
    console.log("replyTo: " + replyTo); // eslint-disable-line
    // console.log('html: '+html);
    // console.log('text: '+text);

    try {
      Email.send(email);
    } catch (error) {
      console.log("// error while sending email:"); // eslint-disable-line
      console.log(error); // eslint-disable-line
      if (throwErrors) throw error;
    }

  } else {

    console.log('//////// sending email (simulation)…'); // eslint-disable-line
    console.log('from: '+from); // eslint-disable-line
    console.log('to: '+to); // eslint-disable-line
    console.log("cc: " + cc); // eslint-disable-line
    console.log("bcc: " + bcc); // eslint-disable-line
    console.log("replyTo: " + replyTo); // eslint-disable-line

  }

  return email;

};

VulcanEmail.build = async ({ emailName, variables, locale }) => {
  // execute email's GraphQL query
  const email = VulcanEmail.emails[emailName];
  const result = email.query ? await runQuery(email.query, variables, { locale }) : {data: {}};

  // if email has a data() function, merge its return value with results from the query
  const data = email.data ? {...result.data, ...email.data(variables)} : result.data;

  const subject = typeof email.subject === 'function' ? email.subject(data) : email.subject;

  data.__ = Strings[locale];

  const html = VulcanEmail.buildTemplate(VulcanEmail.getTemplate(email.template)(data), data, locale);

  return { data, subject, html };
}


VulcanEmail.buildAndSend = async ({ to, cc, bcc, replyTo, emailName, variables, locale = getSetting("locale") }) => {
  const email = await VulcanEmail.build({ to, emailName, variables, locale });
  return VulcanEmail.send(to, cc, bcc, replyTo, email.subject, email.html);
};

VulcanEmail.buildAndSendHTML = (to, subject, html) => VulcanEmail.send(to,'','','', subject, VulcanEmail.buildTemplate(html));
