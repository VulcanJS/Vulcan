Meteor.methods({
  post: function(post){
    var user = Meteor.user();

    if (!user || !canPost(user))
      throw new Meteor.Error(123, 'You need to login or be invited to post new stories.');

    if(!post.headline || !post.url)
      throw new Meteor.Error(456, 'Please fill in a headline and URL');

    if(!this.isSimulation)
        limitRate(user, Posts, 30);

    post = _.extend(post, {
      userId: user._id,
      author: getDisplayName(user),
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