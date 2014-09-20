Template[getTemplate('unsubscribe')].created = function(){
  var hash = this.data.hash;
  Meteor.call('unsubscribeUser', hash, function(error, result){
    if(result){
      Session.set('unsubscribedMessage', 'You have been unsubscribed from all notifications.');
    }else{
      Session.set('unsubscribedMessage', 'User not found.');
    }
  });
  trackEvent('notificationsUnsubcribe', {hash: hash});
};

Template[getTemplate('unsubscribe')].helpers({
  unsubscribed : function(){
    // we have to use a session variable because the string we want to display
    // depends on the return value of an asynchronous callback (unsubscribeUser)
    return Session.get('unsubscribedMessage');
  }
});