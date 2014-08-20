buildEmailTemplate = function (htmlContent) {

  var juice = Meteor.require('juice');

  var emailProperties = {
    headerColor: getSetting('headerColor', '#444444'),
    buttonColor: getSetting('buttonColor', '#DD3416'),
    siteName: getSetting('title'),
    tagline: getSetting('tagline'),
    siteUrl: getSiteUrl(),
    body: htmlContent,
    unsubscribe: '',
    accountLink: getSiteUrl()+'account',
    footer: getSetting('emailFooter'),
    logoUrl: getSetting('logoUrl'),
    logoHeight: getSetting('logoHeight'),
    logoWidth: getSetting('logoWidth')
  }

  var emailHTML = Handlebars.templates[getTemplate('emailWrapper')](emailProperties);

  var inlinedHTML = Async.runSync(function(done) {
    juice.juiceContent(emailHTML, {
      url: getSiteUrl(),
      removeStyleTags: false
    }, function (error, result) {
      done(null, result);
    });
  }).result;

  var doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'
  
  return doctype+inlinedHTML;
}

sendEmail = function(to, subject, html, text){

  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND
  
  var from = getSetting('defaultEmail', 'noreply@example.com');
  var siteName = getSetting('title');
  var subject = '['+siteName+'] '+subject;

  if (typeof text == 'undefined'){
    // Auto-generate text version if it doesn't exist. Has bugs, but should be good enough. 
    var htmlToText = Meteor.require('html-to-text');
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

  Email.send({
    from: from, 
    to: to, 
    subject: subject, 
    text: text,
    html: html
  });
};

buildAndSendEmail = function (to, subject, template, properties) {
  var html = buildEmailTemplate(Handlebars.templates[getTemplate(template)](properties));
  sendEmail (to, subject, buildEmailTemplate(html));
} 