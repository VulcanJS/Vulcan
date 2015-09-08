Meteor.publish('categories', function() {
  if(Users.can.viewById(this.userId)){
    var categories = Categories.find();
    var publication = this;

    categories.forEach(function (category) {
      var cursor = Posts.find({$and: [{categories: {$in: [category._id]}}, {status: Posts.config.STATUS_APPROVED}]});
      Counts.publish(publication, category.getCounterName(), cursor, { noReady: true });
    });

    return categories;
  }
  return [];
});
