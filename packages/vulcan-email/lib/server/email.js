/* eslint-disable no-console */
import { VulcanEmail } from '../modules/index.js';
import Juice from 'juice';
import htmlToText from 'html-to-text';
import Handlebars from 'handlebars';
import { Utils, getSetting, registerSetting, runQuery, Strings, getString } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core is not loaded yet
import { Email } from 'meteor/email';
import get from 'lodash/get';

/*

Get intl string, accepts a second optional values argument. Usage: {{__ "posts.create"}} or {{__ "posts.create" postValues}}

*/
Handlebars.registerHelper('__', function(id, values, context) {
  if (typeof context === 'undefined') {
    // if context is undefined, then we only have two arguments and context
    // should be the second one; and values is undefined
    context = values;
    values = undefined;
  }
  const s = getString({ id, values, locale: get(context, 'data.root.locale') });
  return new Handlebars.SafeString(s);
});

Handlebars.registerHelper('log', function(value) {
  console.log(JSON.stringify(value, '', 2));
});

registerSetting('secondaryColor', '#444444');
registerSetting('accentColor', '#DD3416');
registerSetting('title', 'My App');
registerSetting('tagline');
registerSetting('emailFooter');
registerSetting('logoUrl');
registerSetting('logoReverseUrl');
registerSetting('logoHeight');
registerSetting('logoWidth');
registerSetting('defaultEmail', 'noreply@example.com');
registerSetting('title', 'Vulcan');
registerSetting('enableDevelopmentEmails', false);

VulcanEmail.templates = {};

export const addTemplates = templates => {
  _.extend(VulcanEmail.templates, templates);
};
VulcanEmail.addTemplates = addTemplates;

export const getTemplate = templateName => {
  if (!VulcanEmail.templates[templateName]) {
    throw new Error(`Couldn't find email template named  “${templateName}”`);
  }
  return Handlebars.compile(VulcanEmail.templates[templateName], { noEscape: true, strict: true });
};
VulcanEmail.getTemplate = getTemplate;

export const buildTemplate = (htmlContent, data = {}, locale) => {
  const emailProperties = {
    secondaryColor: getSetting('secondaryColor', '#444444'),
    accentColor: getSetting('accentColor', '#DD3416'),
    siteName: getSetting('title', 'My App'),
    tagline: getSetting('tagline'),
    siteUrl: Utils.getSiteUrl(),
    rootUrl: Utils.getRootUrl(),
    body: htmlContent,
    unsubscribe: '',
    accountLink: Utils.getSiteUrl() + 'account',
    footer: getSetting('emailFooter'),
    logoUrl: getSetting('logoUrl'),
    logoReverseUrl: getSetting('logoReverseUrl'),
    logoHeight: getSetting('logoHeight'),
    logoWidth: getSetting('logoWidth'),
    ...data,
    __: Strings[locale],
  };

  let emailHTML = htmlContent;

  const wrapper = VulcanEmail.getTemplate('wrapper');
  if (typeof wrapper === 'function') {
    try {
      emailHTML = VulcanEmail.getTemplate('wrapper')(emailProperties);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('// getTemplate error, email wrapper template cannot be used');
      console.log(error);
    }
  }

  const inlinedHTML = Juice(emailHTML, { preserveMediaQueries: true });
  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';

  return doctype + inlinedHTML;
};
VulcanEmail.buildTemplate = buildTemplate;

export const generateTextVersion = html => {
  return htmlToText.fromString(html, {
    wordwrap: 130,
  });
};
VulcanEmail.generateTextVersion = generateTextVersion;

export const send = (to, subject, html, text, throwErrors, cc, bcc, replyTo, headers, attachments, from) => {
  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND

  if (typeof to === 'object') {
    // eslint-disable-next-line no-redeclare
    var { to, cc, bcc, replyTo, subject, html, text, throwErrors, headers, attachments, from } = to;
  }

  const _from = from || getSetting('defaultEmail', 'noreply@example.com');
  const siteName = getSetting('title', 'Vulcan');
  subject = subject || '[' + siteName + ']';

  if (typeof text === 'undefined') {
    // Auto-generate text version if it doesn't exist. Has bugs, but should be good enough.
    text = VulcanEmail.generateTextVersion(html);
  }

  // in dev or staging environments, add suffix to email subjects to differentiate them.
  const environment = getSetting('environment');
  if (['development', 'staging'].includes(environment)) {
    subject = `${subject} [${environment}]`;
  }

  const email = {
    from: _from,
    to,
    cc,
    bcc,
    replyTo,
    subject,
    headers,
    text,
    html,
    attachments,
  };

  const shouldSendEmail = process.env.NODE_ENV === 'production' || getSetting('enableDevelopmentEmails', false);

  console.log(`✉️  sending email${shouldSendEmail ? '' : ' (simulation)'}…`); // eslint-disable-line
  console.log('from: ' + _from); // eslint-disable-line
  console.log('to: ' + to); // eslint-disable-line
  console.log('subject: ' + subject); // eslint-disable-line
  // console.log('cc: ' + cc); // eslint-disable-line
  // console.log('bcc: ' + bcc); // eslint-disable-line
  // console.log('replyTo: ' + replyTo); // eslint-disable-line
  // console.log('headers: ' + JSON.stringify(headers)); // eslint-disable-line

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
VulcanEmail.send = send;

export const build = async ({ to: staticTo, emailName, variables, locale }) => {
  let html, htmlContents;
  // execute email's GraphQL query
  const email = VulcanEmail.emails[emailName];

  if (!email) {
    throw new Error(`Could not find email [${emailName}]`);
  }

  try {
    const result = email.query ? await runQuery(email.query, variables, { locale }) : { data: {} };

    // if email has a data() function, merge its return value with results from the query
    const data = email.data ? { ...result.data, ...email.data({ data: result.data, variables, locale }) } : result.data;

    const subject = typeof email.subject === 'function' ? email.subject({ data, variables, locale }) : email.subject;
    const to = staticTo || (typeof email.to === 'function' ? email.to({ data, variables, locale }) : email.to);

    data.__ = Strings[locale];
    data.locale = locale;

    // try generating htmlContents, if it fails default to using templateError template instead
    try {
      htmlContents = VulcanEmail.getTemplate(email.template)(data);
    } catch (error) {
      htmlContents = VulcanEmail.getTemplate('templateError')({ ...data, email, error: error.message });
      console.log('// getTemplate error');
      console.log(error);
    }

    html = VulcanEmail.buildTemplate(htmlContents, data, locale);

    return { data, subject, html, to };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Error while building email [${emailName}]`);
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
VulcanEmail.build = build;

export const buildAndSend = async ({
  to,
  cc,
  bcc,
  replyTo,
  emailName,
  variables,
  locale = getSetting('locale'),
  headers,
  attachments,
  from,
}) => {
  try {
    const email = await build({ to, emailName, variables, locale });
    return send({ to: email.to, cc, bcc, replyTo, subject: email.subject, html: email.html, headers, attachments, from });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
VulcanEmail.buildAndSend = buildAndSend;

export const buildAndSendHTML = (to, subject, html) => VulcanEmail.send(to, subject, VulcanEmail.buildTemplate(html));
VulcanEmail.buildAndSendHTML = buildAndSendHTML;
