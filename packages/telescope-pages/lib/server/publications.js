Meteor.publish('pages', function() {
  if(isAdminById(this.userId)){
    return Pages.collection.find();
  }
  return [];
});
