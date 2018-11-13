/* eslint-disable no-console */
import VulcanEmail from '../namespace.js';
import Juice from 'juice';
import htmlToText from 'html-to-text';
import Handlebars from 'handlebars';
import { Utils, getSetting, registerSetting, runQuery, Strings, getString } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core is not loaded yet

/*

Get intl string. Usage: {{__ "posts.create"}}

*/
Handlebars.registerHelper('__', function(id, context) {
  const s = getString({ id, locale: context.data.root.locale });
  return new Handlebars.SafeString(s);
});

/*

Get intl string, accepts a second variables argument. Usage: {{__ "posts.create" postVariables}}

*/
Handlebars.registerHelper('___', function(id, variables, context) {
  const s = getString({ id, variables, locale: context.data.root.locale });
  return new Handlebars.SafeString(s);
});

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

VulcanEmail.getTemplate = templateName => {
  if (!VulcanEmail.templates[templateName]) {
    throw new Error(`Couldn't find email template named  “${templateName}”`);
  }
  return Handlebars.compile(VulcanEmail.templates[templateName], { noEscape: true, strict: true });
}

VulcanEmail.buildTemplate = (htmlContent, data = {}, locale) => {
  const emailProperties = {
    secondaryColor: getSetting('secondaryColor', '#444444'),
    accentColor: getSetting('accentColor', '#DD3416'),
    siteName: getSetting('title', 'My App'),
    tagline: getSetting('tagline'),
    siteUrl: Utils.getSiteUrl(),
    body: htmlContent,
    unsubscribe: '',
    accountLink: Utils.getSiteUrl() + 'account',
    footer: getSetting('emailFooter'),
    logoUrl: getSetting('logoUrl'),
    logoHeight: getSetting('logoHeight'),
    logoWidth: getSetting('logoWidth'),
    ...data,
    __: Strings[locale],
  };

  const emailHTML = VulcanEmail.getTemplate('wrapper')(emailProperties);
  const inlinedHTML = Juice(emailHTML, { preserveMediaQueries: true });
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';

  return doctype + inlinedHTML;
};

VulcanEmail.generateTextVersion = html => {
  return htmlToText.fromString(html, {
    wordwrap: 130,
  });
};

VulcanEmail.send = (to, subject, html, text, throwErrors, cc, bcc, replyTo, headers) => {
  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND

  if (typeof to === 'object') {
    // eslint-disable-next-line no-redeclare
    var { to, cc, bcc, replyTo, subject, html, text, throwErrors, headers } = to;
  }

  const from = getSetting('defaultEmail', 'noreply@example.com');
  const siteName = getSetting('title', 'Vulcan');
  subject = subject || '[' + siteName + ']';

  if (typeof text === 'undefined') {
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
    headers: headers,
    text: text,
    html: html,
  };

  const shouldSendEmail = process.env.NODE_ENV === 'production' || getSetting('enableDevelopmentEmails', false)

  console.log(`//////// sending email${shouldSendEmail ? '' : ' (simulation)'}…`); // eslint-disable-line
  console.log('from: ' + from); // eslint-disable-line
  console.log('to: ' + to); // eslint-disable-line
  console.log('cc: ' + cc); // eslint-disable-line
  console.log('bcc: ' + bcc); // eslint-disable-line
  console.log('replyTo: ' + replyTo); // eslint-disable-line
  console.log('headers: ' + JSON.stringify(headers)); // eslint-disable-line

  if (shouldSendEmail) {
    try {
      Email.send(email);
    } catch (error) {
      console.log('// error while sending email:'); // eslint-disable-line
      console.log(error); // eslint-disable-line
      if (throwErrors) throw error;
    }
  }

  return email;
};

VulcanEmail.build = async ({ emailName, variables, locale }) => {
  // execute email's GraphQL query
  const email = VulcanEmail.emails[emailName];
  const result = email.query ? await runQuery(email.query, variables, { locale }) : { data: {} };

  // if email has a data() function, merge its return value with results from the query
  const data = email.data ? { ...result.data, ...email.data({ data: result.data, variables, locale }) } : result.data;

  const subject = typeof email.subject === 'function' ? email.subject({ data, variables, locale }) : email.subject;

  data.__ = Strings[locale];
  data.locale = locale;

  const html = VulcanEmail.buildTemplate(VulcanEmail.getTemplate(email.template)(data), data, locale);

  return { data, subject, html };
};

VulcanEmail.buildAndSend = async ({ to, cc, bcc, replyTo, emailName, variables, locale = getSetting('locale'), headers }) => {
  const email = await VulcanEmail.build({ to, emailName, variables, locale });
  return VulcanEmail.send({ to, cc, bcc, replyTo, subject: email.subject, html: email.html, headers });
};

VulcanEmail.buildAndSendHTML = (to, subject, html) => VulcanEmail.send(to, subject, VulcanEmail.buildTemplate(html));
