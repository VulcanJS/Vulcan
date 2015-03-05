if(Meteor.isClient){
  // Local (client-only) collection
  Messages = new Meteor.Collection(null);

  flashMessage = function(message, type){
    type = (typeof type === 'undefined') ? 'error': type;
    // Store errors in the 'Messages' local collection
    Messages.insert({message:message, type:type, seen: false, show:true});
  };

  clearSeenMessages = function(){
    Messages.update({seen:true}, {$set: {show:false}}, {multi:true});
  };

}