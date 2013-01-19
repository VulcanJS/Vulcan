Template.unsubscribe.helpers({
  unsubscribed : function(){
    var hash = Session.get('userEmailHash');
    Meteor.call('unsubscribeUser', hash) ? 'You have been unsubscribed.' : 'User not found.' ;
  }
});