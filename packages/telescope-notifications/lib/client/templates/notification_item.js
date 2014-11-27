Template[getTemplate('notificationItem')].helpers({
  properties: function(){
    return this.data;
  },
  notificationHTML: function(){
    return this.message();
  }
});

Template[getTemplate('notificationItem')].events({
  'click .action-link': function(event, instance){
    var notificationId=instance.data._id;
    Herald.collection.update(
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
