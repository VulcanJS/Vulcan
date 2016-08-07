(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/email.js                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
                                                                                                                // 1
var htmlToText = Npm.require('html-to-text');                                                                   // 2
                                                                                                                // 3
// check if server-side template has been customized, and return the correct template                           // 4
getEmailTemplate = function (template) {                                                                        // 5
  var emailTemplate = Handlebars.templates[getTemplate(template)];                                              // 6
  if(typeof emailTemplate === 'function'){                                                                      // 7
    return Handlebars.templates[getTemplate(template)];                                                         // 8
  } else {                                                                                                      // 9
    console.log('Cannot find template '+getTemplate(template)+', defaulting to '+template);                     // 10
    return Handlebars.templates[template];                                                                      // 11
  }                                                                                                             // 12
}                                                                                                               // 13
                                                                                                                // 14
buildEmailTemplate = function (htmlContent) {                                                                   // 15
                                                                                                                // 16
  var emailProperties = {                                                                                       // 17
    headerColor: getSetting('headerColor', '#444444'),                                                          // 18
    buttonColor: getSetting('buttonColor', '#DD3416'),                                                          // 19
    siteName: getSetting('title'),                                                                              // 20
    tagline: getSetting('tagline'),                                                                             // 21
    siteUrl: getSiteUrl(),                                                                                      // 22
    body: htmlContent,                                                                                          // 23
    unsubscribe: '',                                                                                            // 24
    accountLink: getSiteUrl()+'account',                                                                        // 25
    footer: getSetting('emailFooter'),                                                                          // 26
    logoUrl: getSetting('logoUrl'),                                                                             // 27
    logoHeight: getSetting('logoHeight'),                                                                       // 28
    logoWidth: getSetting('logoWidth')                                                                          // 29
  }                                                                                                             // 30
                                                                                                                // 31
  var emailHTML = Handlebars.templates[getTemplate('emailWrapper')](emailProperties);                           // 32
                                                                                                                // 33
  var inlinedHTML = Async.runSync(function(done) {                                                              // 34
    juice.juiceContent(emailHTML, {                                                                             // 35
      url: getSiteUrl(),                                                                                        // 36
      removeStyleTags: false                                                                                    // 37
    }, function (error, result) {                                                                               // 38
      done(null, result);                                                                                       // 39
    });                                                                                                         // 40
  }).result;                                                                                                    // 41
                                                                                                                // 42
  var doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'
                                                                                                                // 44
  return doctype+inlinedHTML;                                                                                   // 45
}                                                                                                               // 46
                                                                                                                // 47
sendEmail = function(to, subject, html, text){                                                                  // 48
                                                                                                                // 49
  // TODO: limit who can send emails                                                                            // 50
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND                                                         // 51
                                                                                                                // 52
  var from = getSetting('defaultEmail', 'noreply@example.com');                                                 // 53
  var siteName = getSetting('title');                                                                           // 54
  var subject = '['+siteName+'] '+subject;                                                                      // 55
                                                                                                                // 56
  if (typeof text == 'undefined'){                                                                              // 57
    // Auto-generate text version if it doesn't exist. Has bugs, but should be good enough.                     // 58
    var text = htmlToText.fromString(html, {                                                                    // 59
        wordwrap: 130                                                                                           // 60
    });                                                                                                         // 61
  }                                                                                                             // 62
                                                                                                                // 63
  console.log('//////// sending email…');                                                                       // 64
  console.log('from: '+from);                                                                                   // 65
  console.log('to: '+to);                                                                                       // 66
  console.log('subject: '+subject);                                                                             // 67
  // console.log('html: '+html);                                                                                // 68
  // console.log('text: '+text);                                                                                // 69
                                                                                                                // 70
  var email = {                                                                                                 // 71
    from: from,                                                                                                 // 72
    to: to,                                                                                                     // 73
    subject: subject,                                                                                           // 74
    text: text,                                                                                                 // 75
    html: html                                                                                                  // 76
  }                                                                                                             // 77
                                                                                                                // 78
  Email.send(email);                                                                                            // 79
                                                                                                                // 80
  return email;                                                                                                 // 81
};                                                                                                              // 82
                                                                                                                // 83
buildAndSendEmail = function (to, subject, template, properties) {                                              // 84
  var html = buildEmailTemplate(getEmailTemplate(template)(properties));                                        // 85
  return sendEmail (to, subject, html);                                                                         // 86
}                                                                                                               // 87
                                                                                                                // 88
Meteor.methods({                                                                                                // 89
  testEmail: function () {                                                                                      // 90
    if(isAdminById(this.userId)){                                                                               // 91
      var email = buildAndSendEmail (getSetting('defaultEmail'), 'Telescope email test', 'emailTest', {date: new Date()});
    }                                                                                                           // 93
  }                                                                                                             // 94
})                                                                                                              // 95
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/routes.js                                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Meteor.startup(function () {                                                                                    // 1
                                                                                                                // 2
  // New user email                                                                                             // 3
                                                                                                                // 4
  Router.route('/email/new-user/:id?', {                                                                        // 5
    name: 'newUser',                                                                                            // 6
    where: 'server',                                                                                            // 7
    action: function() {                                                                                        // 8
      var user = Meteor.users.findOne(this.params.id);                                                          // 9
      var emailProperties = {                                                                                   // 10
        profileUrl: getProfileUrl(user),                                                                        // 11
        username: getUserName(user)                                                                             // 12
      };                                                                                                        // 13
      html = getEmailTemplate('emailNewUser')(emailProperties);                                                 // 14
      this.response.write(buildEmailTemplate(html));                                                            // 15
      this.response.end();                                                                                      // 16
    }                                                                                                           // 17
  });                                                                                                           // 18
                                                                                                                // 19
  // New post email                                                                                             // 20
                                                                                                                // 21
  Router.route('/email/new-post/:id?', {                                                                        // 22
    name: 'newPost',                                                                                            // 23
    where: 'server',                                                                                            // 24
    action: function() {                                                                                        // 25
      var post = Posts.findOne(this.params.id);                                                                 // 26
      console.log(templates)                                                                                    // 27
      if (!!post) {                                                                                             // 28
        html = getEmailTemplate('emailNewPost')(getPostProperties(post));                                       // 29
      } else {                                                                                                  // 30
        html = "<h3>No post found.</h3>"                                                                        // 31
      }                                                                                                         // 32
      this.response.write(buildEmailTemplate(html));                                                            // 33
      this.response.end();                                                                                      // 34
    }                                                                                                           // 35
  });                                                                                                           // 36
                                                                                                                // 37
                                                                                                                // 38
});                                                                                                             // 39
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/templates/handlebars.emailAccountApproved.js                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">{{username}}, welcome to {{siteTitle}}!</span><br><br>\n\nYou've just been invited. <a href=\"{{siteUrl}}\">Start posting</a>.<br><br>");Handlebars.templates["emailAccountApproved"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailAccountApproved"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/templates/handlebars.emailInvite.js                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{invitedBy}}</a>\ninvited you to join {{communityName}}\n</span><br><br>\n\n{{#if newUser}}\n<a href=\"{{actionLink}}\">Join {{communityName}}</a>\n{{else}}\n<a href=\"{{actionLink}}\">Sign in to {{communityName}}</a>\n{{/if}}\n<br><br>\n");Handlebars.templates["emailInvite"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailInvite"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/templates/handlebars.emailNewComment.js                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{comment.author}}</a>\nleft a new comment on \n<a href=\"{{postLink}}\" class=\"action-link\">{{post.title}}</a>:\n</span>\n<br/><br/>\n\n<div class=\"comment-body\">\n{{{body}}}\n</div>\n<br>\n\n<a href=\"{{postCommentUrl}}\" class=\"action-link\">Discuss</a><br/><br/>");Handlebars.templates["emailNewComment"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewComment"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/templates/handlebars.emailNewPost.js                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{postAuthorName}}</a>\nhas created a new post:\n{{#if url}}\n  <a href=\"{{linkUrl}}\" class=\"action-link\">{{postTitle}}}</a>\n{{else}}\n  {{postTitle}}}\n{{/if}}\n</span><br><br>\n\n{{#if body}}\n  <div class=\"post-body\">\n  {{{body}}}\n  </div>\n  <br>\n{{/if}}\n\n<a href=\"{{postUrl}}\">Discuss</a><br><br>");Handlebars.templates["emailNewPost"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewPost"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/templates/handlebars.emailNewReply.js                                    //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\"><a href=\"{{profileUrl}}\">{{comment.author}}</a>\nhas replied to your comment on\n<a href=\"{{postLink}}\" class=\"action-link\">{{post.title}}</a>:\n</span>\n<br/><br/>\n\n<div class=\"comment-body\">\n{{{body}}}\n</div>\n<br>\n\n<a href=\"{{postCommentUrl}}\" class=\"action-link\">Discuss</a><br/><br/>");Handlebars.templates["emailNewReply"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewReply"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/templates/handlebars.emailNewUser.js                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">A new user account has been created: <a href=\"{{profileUrl}}\">{{username}}</a></span><br><br>");Handlebars.templates["emailNewUser"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewUser"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/templates/handlebars.emailTest.js                                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">This is just a test</span><br><br>\n\nSent at {{date}}.<br><br>");Handlebars.templates["emailTest"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailTest"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/lib/server/templates/handlebars.emailWrapper.js                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<html lang=\"en\">\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">    <!-- So that mobile webkit will display zoomed in -->\n    <meta name=\"format-detection\" content=\"telephone=no\"> <!-- disable auto telephone linking in iOS -->\n\n    <title>{{siteName}}</title>\n    <style type=\"text/css\">\n\n        /* Resets: see reset.css for details */\n        .ReadMsgBody { width: 100%; background-color: #ebebeb;}\n        .ExternalClass {width: 100%; background-color: #ebebeb;}\n        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height:100%;}\n        body {-webkit-text-size-adjust:none; -ms-text-size-adjust:none;}\n        body {margin:0; padding:0;}\n        table {border-spacing:0;}\n        table td {border-collapse:collapse;}\n        .yshortcuts a {border-bottom: none !important;}\n\n\n        /* Constrain email width for small screens */\n        @media screen and (max-width: 600px) {\n            table[class=\"container\"] {\n                width: 95% !important;\n            }\n            .main-container{\n              font-size: 14px !important;\n            }\n        }\n\n        /* Give content more room on mobile */\n        @media screen and (max-width: 480px) {\n            td[class=\"container-padding\"] {\n                padding-left: 12px !important;\n                padding-right: 12px !important;\n            }\n        }\n        a{\n          color: {{buttonColor}};\n          font-weight: bold;\n          text-decoration: none;\n        }\n        .wrapper{\n          padding: 20px 0;\n        }\n        .container{\n          border-radius: 3px;\n        }\n        .heading-container{\n          background: {{headerColor}};\n          padding: 15px;\n          text-align: center;\n          border-radius: 3px 3px 0px 0px;\n        }\n        .heading-container, .logo{\n          text-align: center;\n          color: white;\n          font-family: Helvetica, sans-serif;\n          font-weight: bold;\n          font-size: 20px;          \n        }\n        .main-container{\n          line-height: 1.7;\n          background: white;\n          padding: 0 30px;\n          font-size: 15px;\n          font-family: Helvetica, sans-serif;\n          color: #555;\n        }\n        .heading{\n          font-weight: bold;\n          font-size: 18px;\n          line-height: 1.5;\n          margin: 0;\n        }\n        .footer-container{\n          background: #ddd;\n          font-family: Helvetica, sans-serif;\n          padding: 30px;\n          color: #777;\n          border-radius: 0px 0px 3px 3px;\n          font-size: 13px;\n        }\n        .post-thumbnail{\n          height: 28px;\n          width: 37px;\n          vertical-align: top;\n        }\n        .post-body, .comment-body{\n          border-top: 1px solid #ddd;\n          border-bottom: 1px solid #ddd;\n          padding: 10px 0;\n        }\n    </style>\n</head>\n<body style=\"margin:0; padding:10px 0;\" bgcolor=\"#ebebeb\" leftmargin=\"0\" topmargin=\"0\" marginwidth=\"0\" marginheight=\"0\">\n\n<br>\n\n<!-- 100% wrapper (grey background) -->\n<table border=\"0\" width=\"100%\" height=\"100%\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#ebebeb\">\n  <tr>\n    <td class=\"wrapper\" align=\"center\" valign=\"top\" bgcolor=\"#ebebeb\" style=\"background-color: #ebebeb;\">\n\n      <!-- 600px container (white background) -->\n      <table border=\"0\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" class=\"container\" bgcolor=\"#ffffff\">\n        <tr>\n          <td class=\"heading-container\">\n            {{#if logoUrl}}\n              <img class=\"logo\" src=\"{{logoUrl}}\" height=\"{{logoHeight}}\" width=\"{{logoWidth}}\" alt=\"{{siteName}}\"/>\n            {{else}}\n              {{siteName}}\n            {{/if}}\n          </td>\n        </tr>\n        <tr>\n          <td class=\"main-container container-padding\" bgcolor=\"#ffffff\">\n            <br>\n\n            {{{body}}}\n\n          </td>\n        </tr>\n        <tr>\n          <td class=\"footer-container\">\n            <a href=\"{{accountLink}}\">Change your notifications settings</a><br/><br/>\n            {{{footer}}}\n          </td>\n        </tr>\n      </table>\n      <!--/600px container -->\n\n    </td>\n  </tr>\n</table>\n<!--/100% wrapper-->\n<br>\n<br>\n</body>\n</html>\n");Handlebars.templates["emailWrapper"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailWrapper"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/de.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_available_for_project["de"] = ["German","Deutsch"];                                           // 8
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","cdn_path":null}); // 9
TAPi18n.languages_available_for_project["en"] = ["English","English"];                                          // 10
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                 // 11
  TAPi18n.translations["de"] = {};                                                                              // 12
}                                                                                                               // 13
                                                                                                                // 14
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                      // 15
  TAPi18n.translations["de"][namespace] = {};                                                                   // 16
}                                                                                                               // 17
                                                                                                                // 18
_.extend(TAPi18n.translations["de"][namespace], {"translation_key":"translation string"});                      // 19
                                                                                                                // 20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/en.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
// integrate the fallback language translations                                                                 // 8
TAPi18n.addResourceBundle("en", namespace, {"translation_key":"translation string"});                           // 9
                                                                                                                // 10
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/es.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_available_for_project["es"] = ["Spanish (Spain)","Español"];                                  // 8
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                 // 9
  TAPi18n.translations["es"] = {};                                                                              // 10
}                                                                                                               // 11
                                                                                                                // 12
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                      // 13
  TAPi18n.translations["es"][namespace] = {};                                                                   // 14
}                                                                                                               // 15
                                                                                                                // 16
_.extend(TAPi18n.translations["es"][namespace], {"translation_key":"translation string"});                      // 17
                                                                                                                // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/fr.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_available_for_project["fr"] = ["French (France)","Français"];                                 // 8
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                 // 9
  TAPi18n.translations["fr"] = {};                                                                              // 10
}                                                                                                               // 11
                                                                                                                // 12
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                      // 13
  TAPi18n.translations["fr"][namespace] = {};                                                                   // 14
}                                                                                                               // 15
                                                                                                                // 16
_.extend(TAPi18n.translations["fr"][namespace], {"translation_key":"translation string"});                      // 17
                                                                                                                // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/it.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_available_for_project["it"] = ["Italian","Italiano"];                                         // 8
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                 // 9
  TAPi18n.translations["it"] = {};                                                                              // 10
}                                                                                                               // 11
                                                                                                                // 12
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                      // 13
  TAPi18n.translations["it"][namespace] = {};                                                                   // 14
}                                                                                                               // 15
                                                                                                                // 16
_.extend(TAPi18n.translations["it"][namespace], {"translation_key":"translation string"});                      // 17
                                                                                                                // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope-email/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/zh-CN.i18n.js               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_available_for_project["zh-CN"] = ["zh-CN","zh-CN"];                                           // 8
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                              // 9
  TAPi18n.translations["zh-CN"] = {};                                                                           // 10
}                                                                                                               // 11
                                                                                                                // 12
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                   // 13
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                // 14
}                                                                                                               // 15
                                                                                                                // 16
_.extend(TAPi18n.translations["zh-CN"][namespace], {"translation_key":"translation string"});                   // 17
                                                                                                                // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
