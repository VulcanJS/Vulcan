Meteor.publish('searches', function(limit) {
  limit = limit || 20;
  if(Users.is.adminById(this.userId)){
   return Searches.find({}, {limit: limit, sort: {timestamp: -1}});
  }
  return [];
});
