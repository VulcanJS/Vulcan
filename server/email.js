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