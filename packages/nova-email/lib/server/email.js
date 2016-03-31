/**
 * Nova email namespace
 * @namespace Novamail
 */

// extend the email meteor core package
import { Email } from 'meteor/email';

const Novamail = {};

Novamail.templates = {};

Novamail.addTemplates = function (templates) {
  _.extend(Novamail.templates, templates);
};

var htmlToText = Npm.require('html-to-text');

// for template "foo", check if "custom_foo" exists. If it does, use it instead
Novamail.getTemplate = function (templateName) {

  var template = templateName;

  // note: template prefixes are disabled
  // go through prefixes and keep the last one (if any) that points to a valid template
  // Telescope.config.customPrefixes.forEach(function (prefix) {
  //   if(typeof Novamail.templates[prefix+templateName] === 'string'){
  //     template = prefix + templateName;
  //   }
  // });

  // return Handlebars.templates[template];

  return function (properties) {
    return Spacebars.toHTML(properties, Novamail.templates[template]);
  }

};

Novamail.buildTemplate = function (htmlContent) {

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

  var emailHTML = Novamail.getTemplate("wrapper")(emailProperties);

  var inlinedHTML = juice(emailHTML);

  var doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'

  return doctype+inlinedHTML;
};

Novamail.send = function(to, subject, html, text){

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
  console.log('from: ', from); // looking what's inside the [object Object] during the recursivity
  console.log('to: ', to);
  console.log('subject: ', subject);
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

Novamail.buildAndSend = function (to, subject, template, properties) {
  var html = Novamail.buildTemplate(Novamail.getTemplate(template)(properties));
  return Novamail.send (to, subject, html);
};

Meteor.methods({
  testNovamail: function () {
    if(Users.is.adminById(this.userId)){
      // test template, not emailTest
      Novamail.buildAndSend (Telescope.settings.get('defaultEmail'), 'Telescope email test', 'test', {date: new Date()});
      //however, this template doesn't exist here -> the method doesn't recognize it when called
    }
  }
});

export default Novamail;
