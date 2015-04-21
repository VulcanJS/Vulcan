Meteor.publish('categories', function() {
  if(Users.can.viewById(this.userId)){
    return Categories.find();
  }
  return [];
});
