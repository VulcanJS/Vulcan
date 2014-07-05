Template[getTemplate('notification_item')].helpers({
  nice_time: function(){
    return moment(this.timestamp).fromNow();
  },
  properties: function(){
    return this.properties;
  },
  notificationHTML: function(){
    return getNotificationContents(this).html;
  }
});

Template[getTemplate('notification_item')].events({
  'click .action-link': function(event, instance){
    var notificationId=instance.data._id;
    Notifications.update(
    {_id: notificationId},
    {
      $set:{
        read: true
      }
    },
    function(error, result){
      if(error){
        console.log(error);
      } 
    }
  );  
  }
});