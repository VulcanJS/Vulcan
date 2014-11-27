Template[getTemplate('unsubscribe')].created = function(){
  var hash = this.data.hash;
  Meteor.call('unsubscribeUser', hash, function(error, result){
    if(result){
      Session.set('unsubscribedMessage', __('you_have_been_unsubscribed_from_all_notifications'));
    }else{
      Session.set('unsubscribedMessage', __('user_not_found'));
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