Template[getTemplate('notificationsMarkAsRead')].events({
  'click .mark-as-read': function(){
    Meteor.call('heraldMarkAllAsRead', 
      function(error, result){
        error && console.log(error);
      }
    );
  }
});
