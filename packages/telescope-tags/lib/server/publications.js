Meteor.publish('categories', function() {
  if(can.viewById(this.userId)){
    return Categories.find();
  }
  return [];
});