Template.messages.helpers({
  messages: function(){
    return Messages.collection.find({show: true});
  }
});
