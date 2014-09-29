Meteor.publish('crfs', function() {
  if(canViewById(this.userId)){
    return CRFs.find();
  }
  return [];
});
