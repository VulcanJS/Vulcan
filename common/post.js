Meteor.methods({
  post: function(post){
    var user = Meteor.user();
    var userId = post.userId || user._id;
    var submitted = parseInt(post.submitted) || new Date().getTime();

    if (!user || !canPost(user))
      throw new Meteor.Error(123, 'You need to login or be invited to post new stories.');

    if(!post.headline)
      throw new Meteor.Error(456, 'Please fill in a headline');

    if(!this.isSimulation)
        limitRate(user, Posts, 30);

    console.log(userId);
    console.log(submitted);
    console.log(post);

    post = _.extend(post, {
      userId: userId,
      author: getDisplayNameById(userId),
      submitted: submitted,
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