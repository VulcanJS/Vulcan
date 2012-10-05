Meteor.methods({
  post: function(post){
    var user = Meteor.user();
    if (!user || !canPost(user))
      throw new Meteor.Error('You need to login or be invited to post new stories.')

    post = _.extend(post, {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime(),
      votes: 0,
      comments: 0,
      baseScore: 0,
      score: 0
    });
    
    var postId=Posts.insert(post);

    Meteor.call('upvotePost', postId);

    return postId;
  }
});