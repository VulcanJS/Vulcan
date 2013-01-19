sendEmail = function(to, subject, text, html){

  // TO-DO: limit who can send emails

  var from = getSetting('defaultEmail') || 'noreply@example.com';
  var siteName = getSetting('title');
  var subject = '['+siteName+'] '+subject

  console.log('sending email…');
  console.log(from)
  console.log(to)
  console.log(subject)
  console.log(text)
  console.log(html)

  Email.send({
    from: from, 
    to: to, 
    subject: subject, 
    text: text,
    html: html
  });
};

Meteor.methods({
  sendNotificationEmail: function(to, notificationId){
    // Note: we query the DB instead of simply passing arguments from the client
    // to make sure our email method cannot be used for spam
    var notification = Notifications.findOne(notificationId);
    var n = getNotification(notification.event, notification.properties);
    sendEmail(to, n.subject, n.text, n.html);
  }
})