var mailchimp = Npm.require('mailchimp');
var Future = Npm.require('fibers/future');

MailChimpAPI = function(key, options) {
  this.asyncAPI = mailchimp.MailChimpAPI(key, options);
}

MailChimpAPI.prototype.listSubscribe = function(options) {
  var future = new Future();
  this.asyncAPI.listSubscribe(options, function(err, res) {
    if (err) {
      future.throw(err);
    } else {
      future.return(res);
    }
  });
  
  return future.wait();
}