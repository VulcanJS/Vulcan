Posts = new Meteor.Collection('posts');

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

Posts.deny({
  update: function(userId, post, fieldNames) {
    if(isAdminById(userId))
      return false;
    // deny the update if it contains something other than the following fields
    return (_.without(fieldNames, 'headline', 'url', 'body', 'shortUrl', 'shortTitle', 'categories').length > 0);
  }
});

Posts.allow({
    insert: canPostById
  , update: canEditById
  , remove: canEditById
});

clickedPosts = [];

Meteor.methods({
  post: function(post){
    var headline = cleanUp(post.headline),
        body = cleanUp(post.body),
        user = Meteor.user(),
        userId = user._id,
        submitted = parseInt(post.submitted) || new Date().getTime(),
        defaultStatus = getSetting('requirePostsApproval') ? STATUS_PENDING : STATUS_APPROVED,
        status = post.status || defaultStatus,
        postWithSameLink = Posts.findOne({url: post.url}), // TODO: limit scope of search to past month or something
        timeSinceLastPost=timeSinceLast(user, Posts),
        numberOfPostsInPast24Hours=numberOfItemsInPast24Hours(user, Posts),
        postInterval = Math.abs(parseInt(getSetting('postInterval', 30))),
        maxPostsPer24Hours = Math.abs(parseInt(getSetting('maxPostsPerDay', 30))),
        postId = '';

    // only let admins post as another user
    if(isAdmin(Meteor.user()))
      userId = post.userId || user._id; 
        
    // check that user can post
    if (!user || !canPost(user))
      throw new Meteor.Error(601, i18n.t('You need to login or be invited to post new stories.'));

    // check that user provided a headline
    if(!post.headline)
      throw new Meteor.Error(602, i18n.t('Please fill in a headline'));

    // check that there are no previous posts with the same link
    if(post.url && (typeof postWithSameLink !== 'undefined')){
      Meteor.call('upvotePost', postWithSameLink);
      throw new Meteor.Error(603, i18n.t('This link has already been posted'), postWithSameLink._id);
    }

    if(!isAdmin(Meteor.user())){
      // check that user waits more than X seconds between posts
      if(!this.isSimulation && timeSinceLastPost < postInterval)
        throw new Meteor.Error(604, i18n.t('Please wait ')+(postInterval-timeSinceLastPost)+i18n.t(' seconds before posting again'));

      // check that the user doesn't post more than Y posts per day
      if(!this.isSimulation && numberOfPostsInPast24Hours > maxPostsPer24Hours)
        throw new Meteor.Error(605, i18n.t('Sorry, you cannot submit more than ')+maxPostsPer24Hours+i18n.t(' posts per day'));
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

    // increment posts count
    Meteor.users.update({_id: userId}, {$inc: {postCount: 1}});

    post = _.extend(post, {_id: postId});

    var postAuthor =  Meteor.users.findOne(post.userId);

    Meteor.call('upvotePost', post, postAuthor);

    if(getSetting('emailNotifications', false)){
      // notify users of new posts
      var notification = {
        event: 'newPost',
        properties: {
          postAuthorName : getDisplayName(postAuthor),
          postAuthorId : post.userId,
          postHeadline : headline,
          postId : postId
        }
      };
      // call a server method because we do not have access to users' info on the client
      Meteor.call('newPostNotify', notification, function(error, result){
        //run asynchronously
      });
    }

    // add the post's own ID to the post object and return it to the client
    post.postId = postId;
    return post;
  },
  post_edit: function(post){
    // TODO: make post_edit server-side?
  },
  approvePost: function(post){
    if(isAdmin(Meteor.user())){
      var now = new Date().getTime();
      Posts.update(post._id, {$set: {status: 2, submitted: now}});
    }else{
      throwError('You need to be an admin to do that.');
    }
  },
  unapprovePost: function(post){
    if(isAdmin(Meteor.user())){
      Posts.update(post._id, {$set: {status: 1}});
    }else{
      throwError('You need to be an admin to do that.');
    }
  },
  clickedPost: function(post, sessionId){
    // only let clients increment a post's click counter once per session
    var click = {_id: post._id, sessionId: sessionId};
    if(_.where(clickedPosts, click).length == 0){
      clickedPosts.push(click);
      Posts.update(post._id, { $inc: { clicks: 1 }});
    }
  },
  deletePostById: function(postId) {
    // remove post comments
    // if(!this.isSimulation) {
    //   Comments.remove({post: postId});
    // }
    // NOTE: actually, keep comments afer all

    // decrement post count
    var post = Posts.findOne({_id: postId});
    if(!Meteor.userId() || !canEditById(Meteor.userId(), post)) throw new Meteor.Error(606, 'You need permission to edit or delete a post');
    
    Meteor.users.update({_id: post.userId}, {$inc: {postCount: -1}});
    Posts.remove(postId);
  }
});
