Meteor.publish('categories', function() {
  if(canViewById(this.userId)){
    return Categories.find();
  }
  return [];
});