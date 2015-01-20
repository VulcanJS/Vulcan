
var htmlToText = Npm.require('html-to-text');

// check if server-side template has been customized, and return the correct template
getEmailTemplate = function (template) {
  var emailTemplate = Handlebars.templates[getTemplate(template)];
  if(typeof emailTemplate === 'function'){
    return Handlebars.templates[getTemplate(template)];
  } else {
    console.log('Cannot find template '+getTemplate(template)+', defaulting to '+template);
    return Handlebars.templates[template];
  }
}

buildEmailTemplate = function (htmlContent) {

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
  var siteName = getSetting('title', 'Telescope');
  var subject = '['+siteName+'] '+subject;

  if (typeof text == 'undefined'){
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
  }

  Email.send(email);

  return email;
};

buildAndSendEmail = function (to, subject, template, properties) {
  var html = buildEmailTemplate(getEmailTemplate(template)(properties));
  return sendEmail (to, subject, html);
}

Meteor.methods({
  testEmail: function () {
    if(isAdminById(this.userId)){
      var email = buildAndSendEmail (getSetting('defaultEmail'), 'Telescope email test', 'emailTest', {date: new Date()});
    }
  }
})

function adminUserCreationNotification (user) {
  // send notifications to admins
  var admins = adminUsers();
  admins.forEach(function(admin){
    if(getUserSetting('notifications.users', false, admin)){
      var emailProperties = {
        profileUrl: getProfileUrl(user),
        username: getUserName(user)
      };
      var html = getEmailTemplate('emailNewUser')(emailProperties);
      sendEmail(getEmail(admin), 'New user account: '+getUserName(user), buildEmailTemplate(html));
    }
  });
  return user;
}
userCreatedCallbacks.push(adminUserCreationNotification);