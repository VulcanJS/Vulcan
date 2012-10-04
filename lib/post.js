Meteor.methods({
  post: function(post){
    post = _.extend(post, {
      userId: Meteor.user()._id,
      author: Meteor.user().username,
      submitted: new Date().getTime(),
      votes: 0,
      comments: 0,
      baseScore: 0,
      score: 0
    });
    
    return Posts.insert(post);
  }
});