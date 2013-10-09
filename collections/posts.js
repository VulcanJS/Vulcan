Posts = new Meteor.Collection('posts');

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

Posts.allow({
    insert: canPostById
  , update: canEditById
  , remove: canEditById
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    if(isAdminById(userId))
      return false;
    // may only edit the following fields:
    return (_.without(fieldNames, 'headline', 'url', 'body', 'shortUrl', 'shortTitle', 'categories').length > 0);
  }
});

Meteor.methods({
  post: function(post){
    var headline = cleanUp(post.headline),
        body = cleanUp(post.body),
        user = Meteor.user(),
        userId = post.userId || user._id,
        submitted = parseInt(post.submitted) || new Date().getTime(),
        defaultStatus = getSetting('requirePostsApproval') ? STATUS_PENDING : STATUS_APPROVED,
        status = post.status || defaultStatus,
        postWithSameLink = Posts.findOne({url: post.url}),
        timeSinceLastPost=timeSinceLast(user, Posts),
        numberOfPostsInPast24Hours=numberOfItemsInPast24Hours(user, Posts),
        postInterval = Math.abs(parseInt(getSetting('postInterval', 30))),
        maxPostsPer24Hours = Math.abs(parseInt(getSetting('maxPostsPerDay', 30))),
        postId = '';

    // check that user can post
    if (!user || !canPost(user))
      throw new Meteor.Error(601, 'You need to login or be invited to post new stories.');

    // check that user provided a headline
    if(!post.headline)
      throw new Meteor.Error(602, 'Please fill in a headline');

    // check that there are no previous posts with the same link
    if(post.url && postWithSameLink){
      Meteor.call('upvotePost', postWithSameLink._id);
      throw new Meteor.Error(603, 'This link has already been posted', postWithSameLink._id);
    }

    if(!isAdmin(Meteor.user())){
      // check that user waits more than X seconds between posts
      if(!this.isSimulation && timeSinceLastPost < postInterval)
        throw new Meteor.Error(604, 'Please wait '+(postInterval-timeSinceLastPost)+' seconds before posting again');

      // check that the user doesn't post more than Y posts per day
      if(!this.isSimulation && numberOfPostsInPast24Hours > maxPostsPer24Hours)
        throw new Meteor.Error(605, 'Sorry, you cannot submit more than '+maxPostsPer24Hours+' posts per day');
    }

    post = _.extend(post, {
      headline: headline,
      body: body,
      userId: userId,
      author: getDisplayNameById(userId),
      createdAt: new Date().getTime(),
      votes: 0,
      comments: 0,
      baseScore: 0,
      score: 0,
      inactive: false,
      status: status
    });

    if(status == STATUS_APPROVED){
      // if post is approved, set its submitted date (if post is pending, submitted date is left blank)
      post.submitted  = submitted;
    }

    postId = Posts.insert(post);

    var postAuthor =  Meteor.users.findOne(post.userId);
    Meteor.call('upvotePost', postId,postAuthor);

    if(getSetting('newPostsNotifications')){
      // notify admin of new posts
      var properties = {
        postAuthorName : getDisplayName(postAuthor),
        postAuthorId : post.userId,
        postHeadline : headline,
        postId : postId
      }
      var notification = getNotification('newPost', properties);
      // call a server method because we do not have access to admin users' info on the client
      Meteor.call('notifyAdmins', notification, Meteor.user(), function(error, result){
        //run asynchronously
      });
    }

    // add the post's own ID to the post object and return it to the client
    post.postId = postId;
    return post;
  },
  post_edit: function(post){
    //TO-DO: make post_edit server-side?
  },
  clickedPost: function(post){
    Posts.update(post._id, { $inc: { clicks: 1 }});
  },
  deletePostById: function(postId) {
    // remove post comments
    if(!this.isSimulation) {
      Comments.remove({post: postId});
    }
    Posts.remove(postId);
  }
});
