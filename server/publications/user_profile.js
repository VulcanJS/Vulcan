// Publish a single user

Meteor.publish('userProfile', function(userIdOrSlug) {
  if(canViewById(this.userId)){
    var options = isAdminById(this.userId) ? {limit: 1} : {limit: 1, fields: privacyOptions};
    var findById = Meteor.users.findOne(userIdOrSlug);
    var findBySlug = Meteor.users.findOne({slug: userIdOrSlug});
    var user = typeof findById !== 'undefined' ? findById : findBySlug;

    // user's own posts
    var userPosts = Posts.find({userId: user._id});
    var postsIds = _.pluck(userPosts.fetch(), '_id');

    // user's own comments
    var userComments = Comments.find({userId: user._id});
    var commentsIds = _.pluck(userComments.fetch(), '_id');

    // add upvoted posts ids
    var postsIds = postsIds.concat(_.pluck(user.votes.upvotedPosts, 'itemId'));

    // add upvoted comments ids
    var commentsIds = commentsIds.concat(_.pluck(user.votes.upvotedComments, 'itemId'));

    // add downvoted posts ids
    var postsIds = postsIds.concat(_.pluck(user.votes.downvotedPosts, 'itemId'));

    // add downvoted comments ids
    var commentsIds = commentsIds.concat(_.pluck(user.votes.downvotedComments, 'itemId'));
      
    // add commented posts ids
    if(!!userComments.count()){ // there might not be any comments
      var commentedPostIds = _.pluck(userComments.fetch(), 'postId');
      var postsIds = postsIds.concat(commentedPostIds);
    }

    return [
      Meteor.users.find({_id: user._id}, options),
      Comments.find({_id: {$in: commentsIds}}),
      Posts.find({_id: {$in: postsIds}})
    ];
  }
  return [];
});
