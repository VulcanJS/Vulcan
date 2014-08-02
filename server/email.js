sendEmail = function(to, subject, text, html){

  // TODO: limit who can send emails
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND
  
  var from = getSetting('defaultEmail', 'noreply@example.com');
  var siteName = getSetting('title');
  var subject = '['+siteName+'] '+subject;

  console.log('sending email…');
  console.log(from);
  console.log(to);
  console.log(subject);
  console.log(text);
  console.log(html);

  Email.send({
    from: from, 
    to: to, 
    subject: subject, 
    text: text,
    html: html
  });
};

buildEmailTemplate = function (htmlContent) {
  var juice = Meteor.require('juice');

  var emailHTML = Handlebars.templates[getTemplate('emailMain')]({
    headerColor: getSetting('headerColor'),
    buttonColor: getSetting('buttonColor'),
    logo: '',
    siteName: getSetting('title'),
    siteUrl: getSiteUrl(),
    body: htmlContent,
    unsubscribe: '',
    footer: ''
  });

  var inlinedHTML = Async.runSync(function(done) {
    juice.juiceContent(emailHTML, {
      url: getSiteUrl(),
      removeStyleTags: false
    }, function (error, result) {
      done(null, result);
    });
  }).result;

  return inlinedHTML;
}