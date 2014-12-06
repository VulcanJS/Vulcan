if(Meteor.isClient){
  // Local (client-only) collection
  Messages = new Meteor.Collection(null);
}