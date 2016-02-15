SmartQuery.addRule(Posts, {
  filter: function (document) {
    return true;
  }
  // fields: function () {
  //   return ["_id", "title", "body"];
  // }
});


Meteor.publish('postList', function(terms) {

  var parameters = Posts.parameters.get(terms),
      posts = Posts.find(parameters.find, parameters.options);

  Counts.publish(this, "postList", Posts.find(parameters.find, parameters.options));

  return posts;
});

Meteor.publish('singlePost', function(postId) {

  return Posts.find(postId);

});