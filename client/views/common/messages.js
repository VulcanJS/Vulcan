Template[getTemplate('messages')].helpers({
  message_item: function () {
    return getTemplate('message_item');
  },
  messages: function(){
    return Messages.find({show: true});
  }
});