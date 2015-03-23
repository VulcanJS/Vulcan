Template[getTemplate('notificationsMarkAsRead')].events({
  'click .mark-as-read': function(e, t){
    e.preventDefault();
    t.$('li').parents('.dropdown').removeClass('dropdown-open');
    Meteor.call('heraldMarkAllAsRead', 
      function(error, result){
        error && console.log(error);
      }
    );
  }
});
