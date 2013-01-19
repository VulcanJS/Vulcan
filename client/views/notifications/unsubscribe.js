Template.unsubscribe.created = function(){
  var hash = Session.get('userEmailHash');
  Meteor.call('unsubscribeUser', hash, function(error, result){
    if(result){
      Session.set('unsubscribedMessage', 'You have been unsubscribed from all notifications.');
    }else{
      Session.set('unsubscribedMessage', 'User not found.');
    }
  });
}

Template.unsubscribe.helpers({
  unsubscribed : function(){
    return Session.get('unsubscribedMessage');
  }
});