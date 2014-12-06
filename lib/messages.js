if(Meteor.isClient){

  flashMessage = function(message, type){
    type = (typeof type === 'undefined') ? 'error': type;
    // Store errors in the 'Errors' local collection
    Errors.insert({message:message, type:type, seen: false, show:true});
  };

  clearSeenMessages = function(){
    Errors.update({seen:true}, {$set: {show:false}}, {multi:true});
  };

}
