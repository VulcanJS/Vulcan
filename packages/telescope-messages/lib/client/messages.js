Messages = {
  // Local (client-only) collection
  collection: new Meteor.Collection(null),

  flash: function(message, type) {
    type = (typeof type === 'undefined') ? 'error': type;
    // Store errors in the local collection
    this.collection.insert({message:message, type:type, seen: false, show:true});
  },

  clearSeen: function() {
    this.collection.update({seen:true}, {$set: {show:false}}, {multi:true});
  }
};
